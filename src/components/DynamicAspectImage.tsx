"use client";

import Image from "next/image";
import { useState } from "react";

interface DynamicAspectImageProps {
  src: string;
  alt: string;
  defaultAspectRatio?: number; // Fallback aspect ratio (width/height)
  containerClassName?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

export default function DynamicAspectImage({
  src,
  alt,
  defaultAspectRatio = 0.75, // 3/4
  containerClassName = "relative overflow-hidden bg-[#f8f5f2] mb-4",
  imageClassName = "object-cover",
  children,
}: DynamicAspectImageProps) {
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);

  const handleImageLoad = (result: any) => {
    if (result.naturalWidth && result.naturalHeight) {
      const ratio = result.naturalWidth / result.naturalHeight;
      setAspectRatio(ratio);
    }
  };

  return (
    <div
      className={containerClassName}
      style={{
        aspectRatio: aspectRatio,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={imageClassName}
        onLoadingComplete={handleImageLoad}
      />
      {children}
    </div>
  );
}
