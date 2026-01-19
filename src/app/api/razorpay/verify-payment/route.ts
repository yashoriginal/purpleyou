import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpay_payment_id, razorpay_signature } =
      await request.json();

    // Validate input
    if (!orderId || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: orderId, razorpay_payment_id, razorpay_signature",
        },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const isValid = verifyPaymentSignature({
      orderId,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
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
      paymentId: razorpay_payment_id,
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
