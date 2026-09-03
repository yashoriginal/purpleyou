import "server-only";

import { getApiBaseUrl } from "@/lib/env";

type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);

    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: NextFetchOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
