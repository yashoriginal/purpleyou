"use client";

import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  maxQuantity?: number;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity = 10,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-[#e6e0da] bg-white w-fit">
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= 1}
        className="p-2 hover:bg-[#f8f5f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <HiOutlineMinus className="w-4 h-4" />
      </button>
      <span className="px-4 py-2 text-sm font-medium w-12 text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= maxQuantity}
        className="p-2 hover:bg-[#f8f5f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <HiOutlinePlus className="w-4 h-4" />
      </button>
    </div>
  );
}
