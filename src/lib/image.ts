/**
 * Image URL normalization utilities
 * Handles conversion of relative paths to absolute URLs for API-hosted images
 */

const DEFAULT_FALLBACK_IMAGE = "/images/hero1.jpg";

/**
 * Normalize image URLs - convert relative paths to proper paths
 * @param url - The image URL (can be relative, absolute, or local path)
 * @returns Normalized image path safe for use with next/image
 */
export function normalizeImageUrl(url?: string): string {
  if (!url) return DEFAULT_FALLBACK_IMAGE;

  // Already a local path
  if (url.startsWith("/")) {
    return url;
  }

  // Already an absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Relative path - prepend /products/ directory
  // This handles filenames like "emerald-bangle-1.jpeg" from the API
  // Returns path like "/products/emerald-bangle-1.jpeg"
  if (url) {
    return `/products/${url}`;
  }

  return DEFAULT_FALLBACK_IMAGE;
}

export { DEFAULT_FALLBACK_IMAGE };
