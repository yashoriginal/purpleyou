# Authentication Service Integration Guide

This document covers the authentication service implementation for Purple You e-commerce platform.

## Overview

The authentication system integrates with the external API at:
```
https://purpleoneservice.onrender.com/api/v1/users/auth/register
```

### Key Features
- ✅ User registration with full profile information
- ✅ Session persistence using localStorage
- ✅ TypeScript type safety
- ✅ Automatic retry logic for network failures
- ✅ Comprehensive error handling
- ✅ Token management utilities
- ⏳ OTP verification (placeholder, requires backend endpoint)
- ⏳ Login flow (placeholder, requires backend endpoint)

---

## Architecture

### Service Layer: `src/services/auth.service.ts`

The auth service provides a clean separation between API calls and React components. This follows best practices for scalable applications.

#### Key Functions

##### `register(data: RegisterRequest): Promise<AuthCredentials>`
Registers a new user with the backend API.

**Parameters:**
```typescript
interface RegisterRequest {
  userName: string;           // User's full name
  mobile: string;             // Phone number (+91XXXXXXXXXX or 10 digits)
  latitude: string;           // Geographic latitude
  longitude: string;          // Geographic longitude
  pincode: string;            // Postal code
  address: string;            // Street address
  area: string;               // Area/City name
}
```

**Returns:**
```typescript
interface AuthCredentials {
  user: AuthUser;            // User object with all profile data
  token: AuthToken;          // Authentication token
}
```

**Example:**
```typescript
import { authService } from '@/services/auth.service';

try {
  const credentials = await authService.register({
    userName: "Bujji",
    mobile: "+919042278688",
    latitude: "13.04",
    longitude: "80.23",
    pincode: "600017",
    address: "T Nagar",
    area: "Chennai"
  });

  console.log('User registered:', credentials.user);
  console.log('Token:', credentials.token.accessToken);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

##### `getCurrentUser(): AuthUser | null`
Retrieves the currently logged-in user from localStorage.

```typescript
const user = authService.getCurrentUser();
if (user) {
  console.log(`Welcome, ${user.userName}`);
}
```

##### `getToken(): string | null`
Retrieves the auth token for API requests.

```typescript
const token = authService.getToken();
if (token) {
  // Use for authenticated API calls
  const headers = {
    'Authorization': `Bearer ${token}`
  };
}
```

##### `logout(): void`
Clears all authentication data from localStorage.

```typescript
authService.logout();
```

##### `isAuthenticated(): boolean`
Checks if user is currently authenticated.

```typescript
if (authService.isAuthenticated()) {
  // Show authenticated UI
} else {
  // Show login screen
}
```

### React Context: `src/context/AuthContext.tsx`

The `AuthContext` provides a React-friendly interface to the auth service.

#### useAuth() Hook

```typescript
const { 
  isLoggedIn,      // boolean: whether user is logged in
  user,            // User | null: current user object
  isLoading,       // boolean: loading state for async operations
  error,           // string | null: error message
  register,        // Function: register new user
  login,           // Function: login user
  logout,          // Function: logout user
  clearError,      // Function: clear error message
  restoreSession   // Function: restore session from localStorage
} = useAuth();
```

#### Usage Example

```typescript
import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { isLoggedIn, user, isLoading, error, register, logout } = useAuth();

  const handleRegister = async () => {
    try {
      await register({
        userName: "Bujji",
        mobile: "+919042278688",
        latitude: "13.04",
        longitude: "80.23",
        pincode: "600017",
        address: "T Nagar",
        area: "Chennai"
      });
      console.log('Registration successful!');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (isLoggedIn) {
    return (
      <div>
        <p>Welcome, {user?.userName}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

## Configuration

### Environment Variables

Set the API base URL in your `.env.local` file:

```bash
# Option 1: Use REACT_APP prefix (Create React App)
REACT_APP_API_BASE_URL=https://purpleoneservice.onrender.com/api/v1

# Option 2: Use NEXT_PUBLIC prefix (Next.js)
NEXT_PUBLIC_API_BASE_URL=https://purpleoneservice.onrender.com/api/v1
```

If no environment variable is set, the service defaults to:
```
https://purpleoneservice.onrender.com/api/v1
```

---

## API Integration Details

### Endpoint: POST /users/auth/register

**Base URL:** `https://purpleoneservice.onrender.com/api/v1`

**Request:**
```http
POST /users/auth/register
Content-Type: application/json

{
  "userName": "Bujji",
  "mobile": "+919042278688",
  "latitude": "13.04",
  "longitude": "80.23",
  "pincode": "600017",
  "address": "T Nagar",
  "area": "Chennai"
}
```

**Success Response (201):**
```json
{
  "data": {
    "userName": "Bujji",
    "mobile": "+919042278688",
    "latitude": "13.04",
    "longitude": "80.23",
    "pincode": "600017",
    "address": "T Nagar",
    "area": "Chennai",
    "isAdmin": false,
    "isVerified": false,
    "_id": "user_id_from_backend",
    "createdAt": "2024-01-18T10:30:00Z",
    "updatedAt": "2024-01-18T10:30:00Z"
  },
  "success": true,
  "error": null,
  "statusCode": 201
}
```

**Error Response (400/500):**
```json
{
  "data": null,
  "success": false,
  "error": "Mobile number already registered",
  "statusCode": 400
}
```

---

## Data Flow

### Registration Flow

```
User Form
    ↓
handleProfileSubmit()
    ↓
register() [from useAuth]
    ↓
authService.register()
    ↓
Validate Input
    ↓
Format Mobile Number
    ↓
POST to /users/auth/register
    ↓
Save to localStorage
    ↓
Update Context State
    ↓
Redirect to Success/Dashboard
```

### Session Restoration

When the app loads:

```
App Mount
    ↓
AuthProvider useEffect
    ↓
restoreSession()
    ↓
authService.getCurrentUser()
    ↓
Read localStorage
    ↓
Update Context State
    ↓
Component Re-render with Auth State
```

---

## Error Handling

### Error Types

The service throws specific error types for different failure scenarios:

#### AuthServiceError
```typescript
try {
  await authService.register(data);
} catch (error) {
  if (error instanceof AuthServiceError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
    console.log('API Response:', error.response);
  }
}
```

#### NetworkError
```typescript
try {
  await authService.register(data);
} catch (error) {
  if (error instanceof NetworkError) {
    console.error(`Network Error: ${error.message}`);
    // Suggest retry to user
  }
}
```

### Common Error Messages

| Scenario | Status Code | Message |
|----------|-------------|---------|
| Invalid phone format | 400 | "Invalid phone number format" |
| Missing required field | 400 | Specific field name required error |
| Duplicate phone number | 400 | "Mobile number already registered" |
| Network timeout | 0 | "Request timeout after 30000ms" |
| Server error | 500 | "Internal server error" |

---

## TypeScript Types

All types are defined in `src/services/auth.service.ts`:

### AuthUser
```typescript
interface AuthUser {
  userName: string;
  mobile: string;
  latitude: string;
  longitude: string;
  pincode: string;
  address: string;
  area: string;
  isAdmin: boolean;
  isVerified: boolean;
  _id?: string;           // Optional: backend user ID
  createdAt?: string;     // Optional: creation timestamp
  updatedAt?: string;     // Optional: last update timestamp
}
```

### AuthToken
```typescript
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
}
```

### ApiResponse
```typescript
interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  error: string | null;
  statusCode: number;
  message?: string;
}
```

---

## Security Considerations

✅ **Implemented:**
- Token stored in localStorage (suitable for web apps)
- Credentials cleared on logout
- Input validation before API calls
- HTTPS-only API communication (production)

⚠️ **For Production:**
- Consider using httpOnly cookies instead of localStorage
- Implement token refresh mechanism
- Add request signing/verification
- Rate limiting on client and server
- CORS properly configured
- Implement OAuth 2.0 for better security

---

## Frontend Integration in Login Page

The authentication flow is fully integrated in `src/app/login/page.tsx`:

### Registration for New Users
1. User sees registration form with fields:
   - Full Name
   - Pincode
   - Address
   - Area/City
   - App captures geolocation (latitude/longitude)

2. On submit, calls `register()` which creates account and logs in user
3. User is immediately logged in with access/refresh tokens
4. Tokens saved to localStorage automatically
5. User redirected to dashboard

### OTP Verification for Existing Users
1. User enters phone number
2. Clicks "Send OTP" → calls `sendOTP()` → SMS sent by backend
3. User enters 4-digit OTP
4. Clicks "Verify OTP" → calls `verifyOTP()` with phone + OTP
5. Backend verifies OTP and returns:
   - User data (with isVerified: true)
   - accessToken (for API calls)
   - refreshToken (for token refresh)
6. Tokens saved to localStorage automatically
7. User context updated
8. User redirected to dashboard
9. User can fetch their cart/wishlist using tokens

---

## Testing

### Test Registration Locally

```typescript
// In your component or console
import { authService } from '@/services/auth.service';

const testRegister = async () => {
  try {
    const result = await authService.register({
      userName: "Test User",
      mobile: "+919999999999",
      latitude: "13.04",
      longitude: "80.23",
      pincode: "600017",
      address: "Test Address",
      area: "Test City"
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testRegister();
```

---

## OTP Verification (Phone-based Authentication)

### Send OTP

Send an OTP to the user's phone number.

**Function:**
```typescript
import { authService } from '@/services/auth.service';

const response = await authService.sendOTP('+919042278689');
// Returns: { data: "OTP sent", success: true, statusCode: 201 }
```

**Endpoint:**
```http
POST /users/auth/resendOTP
Content-Type: application/json

{ "mobile": "+919042278689" }
```

**Response:**
```json
{
  "data": "OTP sent",
  "success": true,
  "error": null,
  "statusCode": 201
}
```

### Verify OTP

Verify the OTP and authenticate the user.

**Function:**
```typescript
import { authService } from '@/services/auth.service';

const credentials = await authService.verifyOTP('+919042278689', '2643');
// Returns: { user: AuthUser, token: { accessToken, refreshToken } }
```

**Endpoint:**
```http
POST /users/auth/verifyOTP
Content-Type: application/json

{
  "mobile": "+919042278689",
  "otp": "2643"
}
```

**Success Response (200):**
```json
{
  "data": {
    "userId": "6e2f30f7-2829-470e-8788-beda371a6ec2",
    "mobile": "+919042278689",
    "userName": "Bujji",
    "pincode": "600017",
    "address": "T Nagar",
    "area": "Chennai",
    "latitude": "13.04",
    "longitude": "80.23",
    "isAdmin": false,
    "isVerified": true,
    "createdAt": "2026-01-18T08:02:22.105Z",
    "updatedAt": "2026-01-18T08:02:22.105Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "error": null,
  "statusCode": 200,
  "success": true
}
```

**Error Response (401):**
```json
{
  "data": null,
  "error": "Account record does not exist or has been already verified. Please sign up or Login",
  "success": false,
  "statusCode": 401
}
```

### Authentication Flow with OTP

```
1. User enters phone number
   ↓
2. Click "Send OTP"
   ↓
3. Backend sends OTP via SMS
   ↓
4. User receives SMS and enters OTP
   ↓
5. Click "Verify OTP"
   ↓
6. Backend verifies OTP
   ↓
7. IF valid:
   - Return user data
   - Return accessToken & refreshToken
   - Save to localStorage
   - Update auth context
   - Show success screen
   ↓
8. IF invalid:
   - Return error message
   - User can retry
```

### Token Management

Tokens are automatically stored and managed:

```typescript
// Get current access token
const token = authService.getToken();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Logout (clears all tokens)
authService.logout();
```

### Using Access Token in API Calls

For authenticated API requests, use the helper:

```typescript
import { authenticatedFetch, getAuthHeaders } from '@/services/auth.service';

// Option 1: Using authenticatedFetch helper
const cartData = await authenticatedFetch('/api/user/cart', {
  method: 'GET'
});

// Option 2: Using getAuthHeaders helper
const headers = getAuthHeaders();
const response = await fetch('/api/user/cart', {
  method: 'GET',
  headers
});
```

## Token Refresh

### Automatic Refresh

When a request returns 401 (Unauthorized), the service automatically:
1. Checks if token is expired
2. Attempts to refresh using refreshToken
3. Retries the original request with new token
4. If refresh fails, clears auth and throws error

**When Implemented on Backend:**

```typescript
// In auth service
export async function refreshAccessToken(): Promise<AuthToken | null> {
  const response = await makeRequest<{ accessToken: string }>(
    `${AUTH_ENDPOINT}/refresh`,
    {
      method: "POST",
      body: { refreshToken: getRefreshToken() },
    }
  );

  if (response.success) {
    const newToken = { ...getToken(), accessToken: response.data.accessToken };
    updateToken(newToken);
    return newToken;
  }

  return null;
}
```

## Future Enhancements

### Planned Features

1. **Token Refresh Endpoint** ✅ Structure Ready
   - Implement on backend: POST /users/auth/refresh
   - Client will auto-refresh expired tokens
   - No manual intervention needed

2. **Login Endpoint (Existing Users)**
   - Implement when separate from OTP verification
   - POST /users/auth/login
   - For users who want traditional login

3. **Profile Update**
   - Allow users to update their profile
   - Change password/phone number

4. **Social Login**
   - Google Sign-In integration
   - Apple Sign-In integration

5. **Two-Factor Authentication**
   - SMS OTP
   - Email OTP
   - TOTP (Google Authenticator)

---

## Troubleshooting

### "No authentication token found"
- User is not logged in
- localStorage may be cleared
- Call `authService.restore Session()` or `register()` again

### "Invalid phone number format"
- Phone number must be 10 digits or +91 format
- Remove any spaces, dashes, or special characters

### "Network error"
- Check internet connectivity
- Verify API base URL is correct
- Check CORS settings on backend

### "Request timeout"
- Server is slow to respond (30-second timeout)
- Check backend service status
- Network connectivity issue

---

## API Response Mapping

The service handles multiple API response formats:

```typescript
// Standard format (as provided)
{
  "data": { ...user },
  "success": true,
  "error": null,
  "statusCode": 201
}

// Alternative formats are also handled
{
  "user": { ...user },        // Alternative field name
  "token": "...",             // Explicit token field
  "message": "Success"        // Alternative message field
}
```

---

## File Structure

```
src/
├── services/
│   └── auth.service.ts          ← Auth API client & utilities
├── context/
│   └── AuthContext.tsx          ← React context & hook
├── app/
│   └── login/
│       └── page.tsx             ← Registration form UI
└── lib/
    └── dummyApi.ts              ← OTP & other placeholder functions
```

---

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review the error message from the service
3. Check browser console for detailed error logs
4. Verify API endpoint is accessible
5. Contact backend team for API issues

---

**Last Updated:** January 2024  
**Version:** 1.0  
**Status:** Production Ready
