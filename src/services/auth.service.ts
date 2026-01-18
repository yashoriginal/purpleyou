/**
 * Auth Service
 * Handles all authentication API calls to the backend
 * API Base: https://purpleoneservice.onrender.com/api/v1/users/auth
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User registration request payload
 */
export interface RegisterRequest {
  userName: string;
  mobile: string; // Format: +919042278688 or 9042278688
  latitude: string;
  longitude: string;
  pincode: string;
  address: string;
  area: string;
}

/**
 * User object returned from the API
 */
export interface AuthUser {
  userName: string;
  mobile: string;
  latitude: string;
  longitude: string;
  pincode: string;
  address: string;
  area: string;
  isAdmin: boolean;
  isVerified: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  error: string | null;
  statusCode: number;
  message?: string;
}

/**
 * Auth API response for register endpoint
 */
export type RegisterResponse = ApiResponse<AuthUser>;

/**
 * OTP send request
 */
export interface SendOTPRequest {
  mobile: string;
}

/**
 * OTP send/resend response
 */
export interface OTPResponse {
  data: string; // "OTP sent" or similar message
  success: boolean;
  error: string | null;
  statusCode: number;
}

/**
 * OTP verification request
 */
export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
}

/**
 * OTP verification response - successful
 */
export interface VerifyOTPResponse {
  data: AuthUser;
  accessToken: string;
  refreshToken: string;
  error: null;
  statusCode: 200;
  success: true;
}

/**
 * OTP verification response - error
 */
export interface VerifyOTPErrorResponse {
  data: null;
  accessToken?: never;
  refreshToken?: never;
  error: string;
  statusCode: number;
  success: false;
}

/**
 * Auth token stored in localStorage
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType: string;
}

/**
 * Credentials stored in context/localStorage
 */
export interface AuthCredentials {
  user: AuthUser;
  token: AuthToken;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                     process.env.NEXT_PUBLIC_API_BASE_URL ||
                     "https://purpleoneservice.onrender.com/api/v1";

const AUTH_ENDPOINT = "/users/auth";

const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class AuthServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public response?: ApiResponse,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH_USER: "auth_user",
  REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * Save auth credentials to localStorage
 */
function saveCredentials(credentials: AuthCredentials): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(credentials.token));
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(credentials.user));
  } catch (error) {
    console.error("Failed to save credentials to localStorage:", error);
  }
}

/**
 * Retrieve auth credentials from localStorage
 */
function getCredentials(): AuthCredentials | null {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (!token || !user) return null;

    return {
      token: JSON.parse(token),
      user: JSON.parse(user),
    };
  } catch (error) {
    console.error("Failed to retrieve credentials from localStorage:", error);
    return null;
  }
}

/**
 * Clear auth credentials from localStorage
 */
function clearCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("Failed to clear credentials:", error);
  }
}

/**
 * Get current auth token
 */
function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as AuthToken;
    return parsed.accessToken;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
}

// ============================================================================
// HTTP UTILITIES
// ============================================================================

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  requiresAuth?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Make HTTP request with automatic retry logic and auth header injection
 */
async function makeRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    requiresAuth = false,
    timeout = REQUEST_TIMEOUT,
    retries = MAX_RETRIES,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Build headers
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = getAuthToken();
      if (!token) {
        throw new AuthServiceError(401, "No authentication token found");
      }
      finalHeaders.Authorization = `Bearer ${token}`;
    }

    // Make request
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    // Parse response
    const data = await response.json() as ApiResponse;

    // Handle non-successful responses
    if (!response.ok) {
      // Check if it's an API error response with our format
      if (data && typeof data === "object" && "error" in data) {
        throw new AuthServiceError(
          data.statusCode || response.status,
          data.error || response.statusText || "Unknown error",
          data,
        );
      } else {
        throw new AuthServiceError(
          response.status,
          response.statusText || "Unknown error",
        );
      }
    }

    return data as T;
  } catch (error) {
    // Handle fetch errors (network, timeout, etc.)
    if (error instanceof TypeError) {
      throw new NetworkError(`Network error: ${error.message}`);
    }

    // Handle AbortError (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NetworkError(`Request timeout after ${timeout}ms`);
    }

    // Re-throw auth service errors
    if (error instanceof AuthServiceError) {
      throw error;
    }

    // Retry logic for network errors
    if (retries > 0 && (error instanceof NetworkError || error instanceof TypeError)) {
      console.warn(`Request failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      return makeRequest<T>(endpoint, { ...options, retries: retries - 1 });
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================================
// AUTH API FUNCTIONS
// ============================================================================

/**
 * Register a new user
 * @param data - Registration form data
 * @returns Registered user and auth token
 */
export async function register(data: RegisterRequest): Promise<AuthCredentials> {
  try {
    // Validate input
    validateRegisterInput(data);

    // Format mobile number (ensure it starts with +91 if it's a 10-digit Indian number)
    const formattedData: RegisterRequest = {
      ...data,
      mobile: formatMobileNumber(data.mobile),
    };

    // Call API
    const response = await makeRequest<RegisterResponse>(`${AUTH_ENDPOINT}/register`, {
      method: "POST",
      body: formattedData,
    });

    // Validate response
    if (!response.success || !response.data) {
      throw new AuthServiceError(
        response.statusCode || 400,
        response.error || "Registration failed",
        response,
      );
    }

    // Create auth credentials
    const credentials: AuthCredentials = {
      user: response.data,
      token: {
        accessToken: response.data._id || "", // Use user ID as token if no explicit token provided
        tokenType: "Bearer",
      },
    };

    // Save to localStorage
    saveCredentials(credentials);

    return credentials;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    throw new AuthServiceError(
      500,
      error instanceof Error ? error.message : "Registration failed",
    );
  }
}

/**
 * Send OTP to phone number
 * @param mobile - Phone number in +91XXXXXXXXXX format
 * @returns OTP response with status
 */
export async function sendOTP(mobile: string): Promise<OTPResponse> {
  try {
    validatePhoneNumber(mobile);

    const formattedMobile = formatMobileNumber(mobile);

    const response = await makeRequest<OTPResponse>(`${AUTH_ENDPOINT}/resendOTP`, {
      method: "POST",
      body: { mobile: formattedMobile },
    });

    if (!response.success) {
      throw new AuthServiceError(
        response.statusCode || 400,
        response.error || "Failed to send OTP",
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    throw new AuthServiceError(
      500,
      error instanceof Error ? error.message : "Failed to send OTP",
    );
  }
}

/**
 * Verify OTP and login user
 * @param mobile - Phone number in +91XXXXXXXXXX format
 * @param otp - 4-digit OTP
 * @returns User credentials with access and refresh tokens
 */
export async function verifyOTP(mobile: string, otp: string): Promise<AuthCredentials> {
  try {
    validatePhoneNumber(mobile);

    if (!otp || otp.length !== 4) {
      throw new Error("OTP must be 4 digits");
    }

    const formattedMobile = formatMobileNumber(mobile);

    const response = await makeRequest<VerifyOTPResponse | VerifyOTPErrorResponse>(
      `${AUTH_ENDPOINT}/verifyOTP`,
      {
        method: "POST",
        body: { mobile: formattedMobile, otp },
      },
    );

    // Handle error response
    if (!response.success || !response.data) {
      throw new AuthServiceError(
        response.statusCode || 401,
        (response as VerifyOTPErrorResponse).error || "OTP verification failed",
      );
    }

    // Handle success response
    const successResponse = response as VerifyOTPResponse;
    const credentials: AuthCredentials = {
      user: successResponse.data,
      token: {
        accessToken: successResponse.accessToken,
        refreshToken: successResponse.refreshToken,
        tokenType: "Bearer",
      },
    };

    // Save to localStorage
    saveCredentials(credentials);

    return credentials;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    throw new AuthServiceError(
      500,
      error instanceof Error ? error.message : "OTP verification failed",
    );
  }
}

/**
 * Login with phone number and OTP
 * Alias for verifyOTP - same functionality
 */
export async function login(phoneNumber: string): Promise<AuthCredentials> {
  try {
    validatePhoneNumber(phoneNumber);

    // For now, this is a placeholder that would call your login endpoint
    // TODO: Implement actual login endpoint on backend
    // const response = await makeRequest<ApiResponse<AuthUser>>(`${AUTH_ENDPOINT}/login`, {
    //   method: "POST",
    //   body: { phoneNumber },
    // });

    console.warn("Login function not yet implemented - waiting for backend endpoint");
    throw new AuthServiceError(501, "Login endpoint not yet implemented");
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    throw new AuthServiceError(
      500,
      error instanceof Error ? error.message : "Login failed",
    );
  }
}

/**
 * Logout and clear credentials
 */
export function logout(): void {
  clearCredentials();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): AuthUser | null {
  const credentials = getCredentials();
  return credentials?.user || null;
}

/**
 * Get current auth token
 */
export function getToken(): string | null {
  return getAuthToken();
}

// ============================================================================
// VALIDATION & FORMATTING UTILITIES
// ============================================================================

/**
 * Validate registration input
 */
function validateRegisterInput(data: RegisterRequest): void {
  if (!data.userName?.trim()) {
    throw new Error("User name is required");
  }

  if (!data.mobile?.trim()) {
    throw new Error("Mobile number is required");
  }

  if (!validatePhoneNumber(data.mobile)) {
    throw new Error("Invalid mobile number format");
  }

  if (!data.pincode?.trim()) {
    throw new Error("Pincode is required");
  }

  if (!data.address?.trim()) {
    throw new Error("Address is required");
  }

  if (!data.area?.trim()) {
    throw new Error("Area is required");
  }

  if (!data.latitude?.trim() || !data.longitude?.trim()) {
    throw new Error("Location coordinates are required");
  }

  // Validate coordinates
  const lat = parseFloat(data.latitude);
  const lon = parseFloat(data.longitude);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error("Invalid latitude/longitude coordinates");
  }
}

/**
 * Validate phone number format
 * Accepts: 10 digits or +91 followed by 10 digits
 */
function validatePhoneNumber(phoneNumber: string): boolean {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  return cleanNumber.length === 10 || (cleanNumber.length === 12 && cleanNumber.startsWith("91"));
}

/**
 * Format mobile number to +91XXXXXXXXXX format
 */
function formatMobileNumber(mobile: string): string {
  const cleanNumber = mobile.replace(/\D/g, "");

  if (cleanNumber.length === 10) {
    return `+91${cleanNumber}`;
  }

  if (cleanNumber.length === 12 && cleanNumber.startsWith("91")) {
    return `+${cleanNumber}`;
  }

  return mobile; // Return as-is if format is already correct
}

// ============================================================================
// EXPORTS
// ============================================================================

export const authService = {
  register,
  sendOTP,
  verifyOTP,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
  getCredentials,
  clearCredentials,
};

export default authService;
