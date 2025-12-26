'use client';

import { useState } from 'react';
import { HiOutlineCheck } from 'react-icons/hi';

interface CheckoutProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | null;

export default function RazorpayCheckout({
  amount,
  orderId,
  customerEmail,
  customerPhone,
}: CheckoutProps) {
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

    setIsProcessing(true);

    // This would integrate with Razorpay API
    // For now, we'll show a success message
    setTimeout(() => {
      console.log('Payment initiated:', {
        method: selectedMethod,
        amount,
        orderId,
        customerEmail,
        customerPhone,
      });

      alert('Payment flow initiated! In production, this would redirect to Razorpay.');
      setIsProcessing(false);
    }, 1000);
  };

  const gst = Math.round(amount * 0.18);
  const total = amount + gst;

  return (
    <div className="max-w-md mx-auto">
      {/* Order Summary */}
      <div className="bg-[#f8f5f2] p-6 mb-6 rounded-lg">
        <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider mb-4">
          Order Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-[#6b6b6b]">
            <span>Subtotal</span>
            <span>₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[#6b6b6b]">
            <span>GST (18%)</span>
            <span>₹{gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-[#e6e0da] pt-3 flex justify-between font-semibold text-[#111111]">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider mb-4">
          Select Payment Method
        </h3>

        {/* UPI */}
        <label className="block mb-4">
          <input
            type="radio"
            name="payment-method"
            value="upi"
            checked={selectedMethod === 'upi'}
            onChange={() => setSelectedMethod('upi')}
            className="hidden"
          />
          <div
            className={`p-4 border-2 cursor-pointer transition-all ${
              selectedMethod === 'upi'
                ? 'border-[#5540b7] bg-[#D3C9FF]/10'
                : 'border-[#e6e0da] hover:border-[#5540b7]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-[#111111]">UPI</span>
              {selectedMethod === 'upi' && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b] mb-3">
              Google Pay, PhonePe, Paytm, BHIM & more
            </p>

            {selectedMethod === 'upi' && (
              <div className="mt-3 pt-3 border-t border-[#e6e0da]">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6e0da] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                />
              </div>
            )}
          </div>
        </label>

        {/* Cards */}
        <label className="block mb-4">
          <input
            type="radio"
            name="payment-method"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={() => setSelectedMethod('card')}
            className="hidden"
          />
          <div
            className={`p-4 border-2 cursor-pointer transition-all ${
              selectedMethod === 'card'
                ? 'border-[#5540b7] bg-[#D3C9FF]/10'
                : 'border-[#e6e0da] hover:border-[#5540b7]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-[#111111]">Credit/Debit Card</span>
              {selectedMethod === 'card' && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b] mb-3">
              Visa, Mastercard, RuPay, AmEx
            </p>

            {selectedMethod === 'card' && (
              <div className="mt-3 pt-3 border-t border-[#e6e0da] space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-[#e6e0da] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="px-3 py-2 border border-[#e6e0da] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={4}
                    className="px-3 py-2 border border-[#e6e0da] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                  />
                </div>
              </div>
            )}
          </div>
        </label>

        {/* Netbanking */}
        <label className="block mb-6">
          <input
            type="radio"
            name="payment-method"
            value="netbanking"
            checked={selectedMethod === 'netbanking'}
            onChange={() => setSelectedMethod('netbanking')}
            className="hidden"
          />
          <div
            className={`p-4 border-2 cursor-pointer transition-all ${
              selectedMethod === 'netbanking'
                ? 'border-[#5540b7] bg-[#D3C9FF]/10'
                : 'border-[#e6e0da] hover:border-[#5540b7]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-[#111111]">Net Banking</span>
              {selectedMethod === 'netbanking' && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b]">
              ICICI, HDFC, Axis, IDBI & all major banks
            </p>
          </div>
        </label>

        {/* COD Info */}
        <div className="p-4 bg-[#f8f5f2] rounded-lg mb-6">
          <p className="text-xs text-[#6b6b6b] flex items-start gap-2">
            <span className="text-[#5540b7] mt-0.5">•</span>
            <span>Cash on Delivery available on select locations</span>
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || !selectedMethod}
        className={`w-full py-4 text-sm font-semibold uppercase tracking-wider transition-all ${
          isProcessing || !selectedMethod
            ? 'bg-[#d0c0e0] text-[#6b6b6b] cursor-not-allowed'
            : 'bg-[#5540b7] text-white hover:bg-[#3d2d7f]'
        }`}
      >
        {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
      </button>

      {/* Security Note */}
      <p className="text-xs text-[#6b6b6b] text-center mt-4">
        🔒 Secure payment powered by Razorpay
      </p>
    </div>
  );
}
