import { NextRequest, NextResponse } from "next/server";

// Route config
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CART_API_BASE = "https://purpleoneservice.onrender.com/api/v1/cart";

async function forwardRequest(
  url: string,
  method: string,
  authHeader: string | null,
  body?: string
): Promise<NextResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => ({
      success: false,
      error: "Invalid response from cart service",
      statusCode: response.status,
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process cart request", statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId is required", statusCode: 400 },
      { status: 400 }
    );
  }

  const authHeader = request.headers.get("authorization");
  return forwardRequest(`${CART_API_BASE}?userId=${userId}`, "GET", authHeader);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId is required", statusCode: 400 },
      { status: 400 }
    );
  }

  const authHeader = request.headers.get("authorization");
  return forwardRequest(`${CART_API_BASE}?userId=${userId}`, "DELETE", authHeader);
}
