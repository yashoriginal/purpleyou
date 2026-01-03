import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await request.json();

    // Validate input
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, paymentId, signature" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const isValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature. Payment verification failed." },
        { status: 400 }
      );
    }

    // Payment verified successfully
    // TODO: Update order status in database
    // TODO: Send order confirmation email
    // TODO: Clear user's cart
    // TODO: Trigger order fulfillment workflow

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId,
      paymentId,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Payment verification failed",
      },
      { status: 500 }
    );
  }
}
