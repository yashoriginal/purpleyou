import { NextRequest, NextResponse } from "next/server";

// Route config
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CART_API_BASE = "https://purpleoneservice.onrender.com/api/v1/cart";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(`${CART_API_BASE}/items`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({
      success: false,
      error: "Invalid response from cart service",
      statusCode: response.status,
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to cart", statusCode: 500 },
      { status: 500 }
    );
  }
}
