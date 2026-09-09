export class ClientApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);

    this.name = "ClientApiError";
  }
}

const PRODUCTION_CLIENT_API_URL = "https://purpleoneservice.onrender.com/api/v1";

function getClientApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_PURPLEYOU_API_BASE_URL;

  if (!value?.trim()) {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      return PRODUCTION_CLIENT_API_URL;
    }

    throw new Error(
      "Missing NEXT_PUBLIC_PURPLEYOU_API_BASE_URL environment variable.",
    );
  }

  return value.trim().replace(/\/+$/, "");
}

export async function clientApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = getClientApiBaseUrl();

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...options,

    headers,

    /*
     * Do not use credentials: "include".
     *
     * V2 is currently matching the
     * original PurpleYou backend contract.
     * The original backend uses wildcard
     * CORS and the legacy frontend did not
     * send credentialed cross-origin requests.
     */

    cache: "no-store",
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    // Some API errors may not contain JSON.
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
    ) {
      message = payload.error;
    }

    throw new ClientApiError(response.status, message);
  }

  return payload as T;
}
