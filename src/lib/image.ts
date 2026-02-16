/**
 * Image URL normalization utilities
 * Handles conversion of relative paths to absolute URLs for API-hosted images
 */

const API_BASE_URL = "https://purpleoneservice.onrender.com";
const DEFAULT_FALLBACK_IMAGE = "/images/hero1.jpg";

/**
 * Normalize image URLs - convert relative paths to absolute API URLs
 * @param url - The image URL (can be relative, absolute, or local path)
 * @returns Normalized image URL safe for use with next/image
 */
export function normalizeImageUrl(url?: string): string {
  if (!url) return DEFAULT_FALLBACK_IMAGE;

  // Already absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Already a local path
  if (url.startsWith("/")) {
    return url;
  }

  // Relative path - convert to absolute URL from API domain
  // e.g., "public/products/image.jpg" -> "https://purpleoneservice.onrender.com/public/products/image.jpg"
  if (url) {
    return `${API_BASE_URL}/${url}`;
  }

  return DEFAULT_FALLBACK_IMAGE;
}

export { DEFAULT_FALLBACK_IMAGE };
