const PRODUCTION_API_URL = "https://purpleoneservice.onrender.com/api/v1";

export function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.PURPLEYOU_API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    if (process.env.NODE_ENV === "production") {
      return PRODUCTION_API_URL;
    }

    throw new Error("Missing PURPLEYOU_API_BASE_URL environment variable.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}
