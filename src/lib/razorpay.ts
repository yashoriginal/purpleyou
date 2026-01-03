/**
 * Razorpay Payment Gateway Service
 * This module handles all Razorpay-related operations
 */

import crypto from "crypto";

// Types
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  description: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: Record<string, any>;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_reason: string | null;
  acquirer_data: Record<string, any>;
  created_at: number;
}

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

/**
 * Create a Razorpay order
 * Call this from your backend API route
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrder> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
    );
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: params.amount, // Amount in paise (multiply rupees by 100)
        currency: params.currency || "INR",
        receipt: params.receipt,
        notes: params.notes || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to create order: ${error.error?.description || "Unknown error"}`
      );
    }

    const order = (await response.json()) as RazorpayOrder;
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

/**
 * Verify payment signature
 * This ensures the payment came from Razorpay and hasn't been tampered with
 */
export function verifyPaymentSignature(
  params: VerifyPaymentParams
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET not configured");
  }

  const message = `${params.orderId}|${params.paymentId}`;
  const signature = crypto
    .createHmac("sha256", keySecret)
    .update(message)
    .digest("hex");

  return signature === params.signature;
}

/**
 * Fetch payment details from Razorpay
 * Optional: Use this to get additional payment information
 */
export async function fetchRazorpayPayment(
  paymentId: string
): Promise<RazorpayPayment> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
    );
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch payment details");
    }

    const payment = (await response.json()) as RazorpayPayment;
    return payment;
  } catch (error) {
    console.error("Error fetching Razorpay payment:", error);
    throw error;
  }
}

/**
 * Refund a payment
 */
export async function refundRazorpayPayment(
  paymentId: string,
  amount?: number
): Promise<any> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(amount && { amount }), // Optional: partial refund amount in paise
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refund payment");
    }

    const refund = await response.json();
    return refund;
  } catch (error) {
    console.error("Error refunding Razorpay payment:", error);
    throw error;
  }
}
