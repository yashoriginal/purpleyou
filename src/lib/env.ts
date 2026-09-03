export function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.PURPLEYOU_API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    throw new Error("Missing PURPLEYOU_API_BASE_URL environment variable.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}
