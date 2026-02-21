"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number; // in milliseconds
  onClose?: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-[#5540b7] text-white px-6 py-4 rounded-lg shadow-lg max-w-sm text-center animate-fade-in">
        {message}
      </div>
    </div>
  );
}
