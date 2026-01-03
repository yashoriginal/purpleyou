# Razorpay Payment Gateway Integration Guide

## Overview
This project is now integrated with **Razorpay**, India's leading payment gateway. Follow the steps below to get your store live with real payments.

## Step 1: Create Razorpay Account
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up for a free account
3. Complete KYC verification (required for live payments)
4. Once verified, you can access API keys

## Step 2: Get Your API Keys
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys**
3. You'll see two types of keys:
   - **Key ID** (public key) - Safe to expose to frontend
   - **Key Secret** (private key) - NEVER expose to frontend or commit to git

## Step 3: Set Environment Variables
You have two options:

### Option A: Using DevServerControl (Recommended for secrets)
```bash
# Contact your developer to set these via DevServerControl
# They should set:
# - NEXT_PUBLIC_RAZORPAY_KEY_ID = your_key_id
# - RAZORPAY_KEY_SECRET = your_key_secret
```

### Option B: Using .env.local File
1. Copy `.env.local.example` to `.env.local`
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your keys:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_key_secret
   ```

3. **IMPORTANT:** Make sure `.env.local` is in `.gitignore` (it is by default in Next.js)

## Step 4: Test Mode vs Live Mode

### Testing (Sandbox)
Use Razorpay's test credentials and test payment methods:
- **Test Card Numbers:**
  - Visa: 4111 1111 1111 1111
  - Mastercard: 5555 5555 5555 4444
- **Any future date for expiry**
- **Any 3-digit CVV**

### Live Mode
To enable live payments:
1. Go to Razorpay Dashboard → Settings → API Keys
2. Switch from "Test Mode" to "Live Mode"
3. Use your live API keys in `.env.local`

## Step 5: Payment Methods Supported
The checkout accepts:
- ✅ **UPI**: Google Pay, PhonePe, Paytm, BHIM, WhatsApp Pay
- ✅ **Cards**: Visa, Mastercard, RuPay, American Express
- ✅ **Netbanking**: All major Indian banks
- ✅ **Wallets**: Supported by Razorpay

## Implementation Details

### Backend API Routes
- **`/api/razorpay/create-order`** - Creates a Razorpay order
  - Request: `{ amount, currency, receipt, notes, customerEmail, customerPhone }`
  - Response: `{ success, order: { id, amount, currency } }`

- **`/api/razorpay/verify-payment`** - Verifies payment signature
  - Request: `{ orderId, paymentId, signature }`
  - Response: `{ success, message }`

### Frontend Payment Flow
1. User fills checkout form
2. Clicks "Pay" button
3. Order is created on backend
4. Razorpay checkout modal opens
5. User completes payment
6. Payment signature is verified on backend
7. User is redirected to order confirmation

### Service Module
Location: `src/lib/razorpay.ts`
Includes:
- `createRazorpayOrder()` - Create orders
- `verifyPaymentSignature()` - Verify payments
- `fetchRazorpayPayment()` - Get payment details
- `refundRazorpayPayment()` - Process refunds

## Security Best Practices

✅ **DO:**
- Keep `RAZORPAY_KEY_SECRET` in `.env.local` (never commit)
- Use `NEXT_PUBLIC_RAZORPAY_KEY_ID` for public key only
- Verify signatures on backend for all payments
- Log payment failures for debugging
- Implement webhook handlers for production

❌ **DON'T:**
- Commit `.env.local` to git
- Expose secret keys in client-side code
- Skip payment verification
- Store sensitive payment data in local storage

## Webhook Integration (Optional - Production)
For production deployments, implement Razorpay webhooks:
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Subscribe to events: `payment.authorized`, `payment.failed`, `order.paid`
4. Implement webhook handler to update order status in database

## Testing the Integration

### Test Scenario 1: Successful Payment
1. Add items to cart
2. Proceed to checkout
3. Fill delivery address
4. Select payment method
5. Click "Pay"
6. Use test card: 4111 1111 1111 1111
7. Any future expiry date
8. Any CVV
9. Should redirect to order confirmation

### Test Scenario 2: Failed Payment
Use card number: 4000 0000 0000 0002
Should show error message

### Test Scenario 3: UPI Payment
1. Select "UPI Payments"
2. Enter test UPI ID
3. Complete payment flow

## Troubleshooting

### Error: "Razorpay credentials not configured"
- Check that `.env.local` has `RAZORPAY_KEY_SECRET`
- Restart dev server after adding env variables
- Check `.env.local` is not in `.gitignore` exceptions

### Error: "Invalid payment signature"
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check that signature verification happens before order confirmation
- Log the signature and order ID for debugging

### Payment modal not opening
- Check that `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Verify Razorpay script loaded successfully (check console)
- Ensure amount is > 0

### "Checkout is not defined"
- Make sure Razorpay script is loaded before calling Razorpay constructor
- Check browser console for script loading errors

## Useful Links
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Dashboard](https://dashboard.razorpay.com)
- [API Documentation](https://razorpay.com/docs/api/)
- [Payment Gateway Setup](https://razorpay.com/docs/payments/payments-gateway-setup/)

## Support
For Razorpay-specific issues:
1. Check Razorpay status page: https://status.razorpay.com/
2. Contact Razorpay support: https://razorpay.com/support/
3. Check API logs in Razorpay Dashboard

For integration issues with this codebase:
- Check `src/lib/razorpay.ts` for available functions
- Review API routes in `src/app/api/razorpay/`
- Check RazorpayCheckout component in `src/components/checkout/`
