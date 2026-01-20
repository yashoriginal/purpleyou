"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  videoUrl?: string;
}

export default function ProductGallery({
  images,
  productName,
  videoUrl,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  // Handle swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Arrow navigation
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Build gallery items (images + video if available)
  const galleryItems: Array<{ type: "image" | "video"; data: ProductImage | string }> = [
    ...images.map((img) => ({ type: "image" as const, data: img })),
    ...(videoUrl ? [{ type: "video" as const, data: videoUrl }] : []),
  ];

  // If no images, show placeholder
  if (galleryItems.length === 0) {
    return (
      <div className="relative bg-[#f8f5f2] aspect-[3/4] overflow-hidden flex items-center justify-center">
        <p className="text-[#6b6b6b]">No images available</p>
      </div>
    );
  }

  const currentItem = galleryItems[currentIndex];
  const isVideo = currentItem.type === "video";

  return (
    <div className="flex flex-col gap-6">
      {/* Main Gallery Container */}
      <div
        ref={containerRef}
        className="relative bg-[#f8f5f2] aspect-[3/4] overflow-hidden group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Main Image */}
        {!isVideo && (
          <Image
            src={(currentItem.data as ProductImage).url}
            alt={(currentItem.data as ProductImage).alt || productName}
            fill
            className="object-cover transition-opacity duration-300"
            priority={currentIndex === 0}
          />
        )}

        {/* Video */}
        {isVideo && (
          <video
            src={currentItem.data as string}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Navigation Arrows */}
        {galleryItems.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6 text-[#111111]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6 text-[#111111]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {galleryItems.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
            {currentIndex + 1} / {galleryItems.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {galleryItems.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {galleryItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-[#111111]"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {item.type === "image" ? (
                <Image
                  src={(item.data as ProductImage).url}
                  alt={(item.data as ProductImage).alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full bg-[#f8f5f2] flex items-center justify-center relative">
                  <video
                    src={item.data as string}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
