'use client';

import { useState } from 'react';
import RazorpayCheckout from '@/components/checkout/RazorpayCheckout';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Lakshadweep', 'Delhi', 'Puducherry'
];

interface AddressForm {
  fullName: string;
  mobileNumber: string;
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  email: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    mobileNumber: '',
    building: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const validateForm = () => {
    const newErrors: Partial<AddressForm> = {};

    if (!address.fullName.trim()) newErrors.fullName = 'Name required';
    if (address.mobileNumber.length !== 10) newErrors.mobileNumber = '10-digit mobile required';
    if (!address.building.trim()) newErrors.building = 'Building/House required';
    if (!address.street.trim()) newErrors.street = 'Street/Locality required';
    if (!address.city.trim()) newErrors.city = 'City required';
    if (!address.state) newErrors.state = 'State required';
    if (address.pinCode.length !== 6) newErrors.pinCode = '6-digit PIN code required';
    if (!address.email.includes('@')) newErrors.email = 'Valid email required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('payment');
    }
  };

  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const subtotal = 12999; // Example amount
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-2">
            Checkout
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-[#6b6b6b]">
            <span className={currentStep === 'address' ? 'text-[#111111]' : ''}>
              1. Delivery Address
            </span>
            <span>→</span>
            <span className={currentStep === 'payment' ? 'text-[#111111]' : ''}>
              2. Payment
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'address' ? (
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl font-light text-[#111111] tracking-wide mb-6">
                  Delivery Address
                </h2>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                        errors.fullName ? 'border-red-500' : 'border-[#e6e0da]'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      value={address.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                        errors.mobileNumber ? 'border-red-500' : 'border-[#e6e0da]'
                      }`}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                    {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                        errors.email ? 'border-red-500' : 'border-[#e6e0da]'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Building/House */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      House/Flat/Building *
                    </label>
                    <input
                      type="text"
                      value={address.building}
                      onChange={(e) => handleInputChange('building', e.target.value)}
                      className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                        errors.building ? 'border-red-500' : 'border-[#e6e0da]'
                      }`}
                      placeholder="House/Flat no., Building name"
                    />
                    {errors.building && <p className="text-xs text-red-500 mt-1">{errors.building}</p>}
                  </div>

                  {/* Street/Locality */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Street/Locality *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                        errors.street ? 'border-red-500' : 'border-[#e6e0da]'
                      }`}
                      placeholder="Road/Locality name"
                    />
                    {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                        errors.city ? 'border-red-500' : 'border-[#e6e0da]'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        State *
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                          errors.state ? 'border-red-500' : 'border-[#e6e0da]'
                        }`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>

                    {/* PIN Code */}
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="tel"
                        value={address.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`w-full px-4 py-3 border text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] ${
                          errors.pinCode ? 'border-red-500' : 'border-[#e6e0da]'
                        }`}
                        placeholder="6-digit PIN"
                        maxLength={6}
                      />
                      {errors.pinCode && <p className="text-xs text-red-500 mt-1">{errors.pinCode}</p>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors mt-8"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl font-light text-[#111111] tracking-wide mb-6">
                  Payment Method
                </h2>
                <RazorpayCheckout
                  amount={subtotal}
                  orderId={`order-${Date.now()}`}
                  customerEmail={address.email}
                  customerPhone={address.mobileNumber}
                />
              </div>
            )}
          </div>

          {/* Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg sticky top-20">
              <h3 className="text-lg font-light text-[#111111] tracking-wide mb-6">
                Order Summary
              </h3>

              {/* Sample Item */}
              <div className="mb-6 pb-6 border-b border-[#e6e0da]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">Minimalist Stud Earrings</p>
                    <p className="text-xs text-[#6b6b6b]">Qty: 1</p>
                  </div>
                  <p className="text-sm font-medium text-[#111111]">₹4,499</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-[#6b6b6b]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6b6b]">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6b6b]">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-[#e6e0da] pt-3 flex justify-between font-semibold text-[#111111]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {currentStep === 'address' && (
                <p className="text-xs text-[#6b6b6b] text-center">
                  All prices include GST
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
