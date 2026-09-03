const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PURPLEYOU_IMAGE_BASE_URL?.replace(/\/+$/, "") ?? "";

export function normalizeProductImageUrl(image: unknown): string | null {
  if (typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const path = value.startsWith("/")
    ? value
    : `/products/${value.replace(/^products\//, "")}`;

  return IMAGE_BASE_URL ? `${IMAGE_BASE_URL}${path}` : path;
}
