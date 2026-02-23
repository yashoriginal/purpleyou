import { NextRequest, NextResponse } from "next/server";

// Route config
export const dynamic = "force-dynamic";
export const revalidate = 0;

const WISHLIST_API_BASE = "https://purpleoneservice.onrender.com/api/v1/wishlist";

async function forwardRequest(
  url: string,
  method: string,
  authHeader: string | null
): Promise<NextResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(url, { method, headers });
    const data = await response.json().catch(() => ({
      success: false,
      error: "Invalid response from wishlist service",
      statusCode: response.status,
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Wishlist API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process wishlist request", statusCode: 500 },
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
  return forwardRequest(`${WISHLIST_API_BASE}?userId=${userId}`, "GET", authHeader);
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
  return forwardRequest(`${WISHLIST_API_BASE}?userId=${userId}`, "DELETE", authHeader);
}
