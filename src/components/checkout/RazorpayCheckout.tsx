'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineCheck } from 'react-icons/hi';

interface CheckoutProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess?: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | null;

export default function RazorpayCheckout({
  amount,
  orderId,
  customerEmail,
  customerPhone,
  onSuccess,
}: CheckoutProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    if (selectedMethod === 'upi' && !upiId.trim()) {
      alert('Please enter UPI ID');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const shippingCost = amount >= 3000 ? 0 : 99;
      const gst = Math.round(amount * 0.18);
      const totalAmount = amount + shippingCost + gst;

      console.log('Payment initiated:', {
        method: selectedMethod,
        amount: totalAmount,
        orderId,
        customerEmail,
        customerPhone,
      });

      // Call success callback if provided (e.g., to clear cart)
      if (onSuccess) {
        onSuccess();
      }

      // In production, this would redirect to Razorpay
      // For now, redirect to order confirmation
      const params = new URLSearchParams({
        orderId: orderId,
        email: customerEmail,
        amount: totalAmount.toLocaleString('en-IN'),
      });
      router.push(`/order-confirmation?${params.toString()}`);
    }, 1500);
  };

  const gst = Math.round(amount * 0.18);
  const shippingCost = amount >= 3000 ? 0 : 99;
  const total = amount + shippingCost + gst;

  return (
    <div>
      {/* Payment Methods */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
          Select Payment Method
        </h3>

        {/* UPI */}
        <label className="block">
          <input
            type="radio"
            name="payment-method"
            value="upi"
            checked={selectedMethod === 'upi'}
            onChange={() => setSelectedMethod('upi')}
            className="hidden"
          />
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === 'upi'
                ? 'border-[#5540b7] bg-[#D3C9FF]/10'
                : 'border-[#e6e0da] hover:border-[#5540b7]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#111111]">UPI Payments</span>
              {selectedMethod === 'upi' && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b] mb-3">
              Google Pay, PhonePe, Paytm, BHIM, WhatsApp Pay & more
            </p>

            {selectedMethod === 'upi' && (
              <div className="mt-4 pt-4 border-t border-[#e6e0da]">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6e0da] text-sm rounded focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>
        </label>

        {/* Cards */}
        <label className="block">
          <input
            type="radio"
            name="payment-method"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={() => setSelectedMethod('card')}
            className="hidden"
          />
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === 'card'
                ? 'border-[#5540b7] bg-[#D3C9FF]/10'
                : 'border-[#e6e0da] hover:border-[#5540b7]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#111111]">Credit/Debit Card</span>
              {selectedMethod === 'card' && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b] mb-3">
              Visa, Mastercard, RuPay, AmEx & all major cards
            </p>

            {selectedMethod === 'card' && (
              <div className="mt-4 pt-4 border-t border-[#e6e0da] space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-[#e6e0da] text-sm rounded focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="px-3 py-2 border border-[#e6e0da] text-sm rounded focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={4}
                    className="px-3 py-2 border border-[#e6e0da] text-sm rounded focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </label>

        {/* Net Banking */}
        <label className="block">
          <input
            type="radio"
            name="payment-method"
            value="netbanking"
            checked={selectedMethod === 'netbanking'}
            onChange={() => setSelectedMethod('netbanking')}
            className="hidden"
          />
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === 'netbanking'
                ? 'border-[#5540b7] bg-[#D3C9FF]/10'
                : 'border-[#e6e0da] hover:border-[#5540b7]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#111111]">Net Banking</span>
              {selectedMethod === 'netbanking' && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b]">
              ICICI, HDFC, Axis, IDBI, SBI & all major Indian banks
            </p>
          </div>
        </label>

        {/* COD Info */}
        <div className="p-4 bg-[#f8f5f2] rounded-lg border border-[#e6e0da]">
          <p className="text-xs text-[#6b6b6b] flex items-start gap-2">
            <span className="text-[#5540b7] font-bold mt-0.5">ℹ</span>
            <span>Cash on Delivery available on select locations</span>
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || !selectedMethod}
        className={`w-full py-4 text-sm font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
          isProcessing || !selectedMethod
            ? 'bg-[#d0c0e0] text-[#6b6b6b] cursor-not-allowed'
            : 'bg-[#5540b7] text-white hover:bg-[#3d2d7f]'
        }`}
      >
        <span className="text-base">🔒</span>
        {isProcessing ? 'Processing Payment...' : `Pay ₹${total.toLocaleString('en-IN')}`}
      </button>

      {/* Security Note */}
      <p className="text-xs text-[#6b6b6b] text-center mt-4">
        🔒 Secure payment powered by Razorpay
      </p>
    </div>
  );
}
