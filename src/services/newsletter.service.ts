/**
 * Newsletter Service
 * Handles all newsletter API calls to the backend
 */

export interface NewsletterSubscribeRequest {
  email: string;
  source: string;
}

export interface NewsletterSubscribeData {
  email: string;
  subscribedAt: string;
  source: string;
  ip: string;
  userAgent: string;
}

export interface NewsletterSubscribeResponse {
  data: NewsletterSubscribeData;
  success: boolean;
  error: null | string;
  statusCode: number;
}

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://purpleoneservice.onrender.com/api/v1";

const REQUEST_TIMEOUT = 30000; // 30 seconds

export class NewsletterServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public response?: NewsletterSubscribeResponse,
  ) {
    super(message);
    this.name = "NewsletterServiceError";
  }
}

/**
 * Make HTTP request for newsletter API
 */
async function makeRequest<T = unknown>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
  } = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = REQUEST_TIMEOUT,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = (await response.json()) as T;

    if (!response.ok) {
      const apiResponse = data as NewsletterSubscribeResponse;
      throw new NewsletterServiceError(
        response.status,
        apiResponse.error || response.statusText || "Unknown error",
        apiResponse,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof NewsletterServiceError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new NewsletterServiceError(0, `Network error: ${error.message}`);
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NewsletterServiceError(
        0,
        `Request timeout after ${timeout}ms`,
      );
    }

    throw new NewsletterServiceError(
      500,
      error instanceof Error ? error.message : "Failed to subscribe to newsletter",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Subscribe to newsletter
 * @param email - Email address to subscribe
 * @param source - Source of subscription (e.g., "web")
 * @returns Newsletter subscription response
 */
export async function subscribeToNewsletter(
  email: string,
  source: string = "web",
): Promise<NewsletterSubscribeData> {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      throw new NewsletterServiceError(400, "Invalid email address");
    }

    const response = await makeRequest<NewsletterSubscribeResponse>(
      "/newsletter/subscribe",
      {
        method: "POST",
        body: {
          email: email.trim(),
          source,
        } as NewsletterSubscribeRequest,
      },
    );

    if (!response.success || !response.data) {
      throw new NewsletterServiceError(
        response.statusCode || 400,
        response.error || "Failed to subscribe to newsletter",
        response,
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof NewsletterServiceError) {
      throw error;
    }
    throw new NewsletterServiceError(
      500,
      error instanceof Error ? error.message : "Failed to subscribe to newsletter",
    );
  }
}

export const newsletterService = {
  subscribeToNewsletter,
};

export default newsletterService;
