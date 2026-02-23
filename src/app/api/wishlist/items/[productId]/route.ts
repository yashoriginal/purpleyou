import { NextRequest, NextResponse } from "next/server";

const WISHLIST_API_BASE = "https://purpleoneservice.onrender.com/api/v1/wishlist";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Check if there's a body (variant data)
    let fetchOptions: RequestInit = {
      method: "DELETE",
      headers,
    };

    try {
      const body = await request.json();
      if (body && Object.keys(body).length > 0) {
        fetchOptions.body = JSON.stringify(body);
      }
    } catch {
      // No body or invalid JSON, continue without it
    }

    const response = await fetch(
      `${WISHLIST_API_BASE}/items/${productId}?userId=${userId}`,
      fetchOptions
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Wishlist API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from wishlist", statusCode: 500 },
      { status: 500 }
    );
  }
}
