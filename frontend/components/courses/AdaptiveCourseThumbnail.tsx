"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";

export const getCourseImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
  const path = imageUrl.replace(/\\/g, "/").replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
};

interface AdaptiveCourseThumbnailProps {
  src?: string | null;
  alt: string;
  badge?: string;
  badgeColor?: string;
  className?: string;
  containerClassName?: string;
  fallbackIcon?: React.ReactNode;
}

/**
 * AdaptiveCourseThumbnail
 * Displays a single course thumbnail across all screen sizes (mobile, tablet, laptop, desktop).
 * Automatically adjusts the container aspect-ratio to match the image dimensions so that
 * none of the image sides (left, right, top, bottom) are cut off or missing.
 */
export default function AdaptiveCourseThumbnail({
  src,
  alt,
  badge,
  badgeColor = "bg-primary",
  className = "",
  containerClassName = "",
  fallbackIcon,
}: AdaptiveCourseThumbnailProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const resolvedUrl = getCourseImageUrl(src);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      if (naturalWidth && naturalHeight) {
        setAspectRatio(naturalWidth / naturalHeight);
        setIsLoaded(true);
      }
    }
  }, [resolvedUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const showFallback = !resolvedUrl || hasError;

  return (
    <div
      className={`relative w-full overflow-hidden bg-gray-100 shrink-0 transition-all duration-300 ${containerClassName}`}
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : "16 / 9",
      }}
    >

      {!showFallback ? (
        <img
          ref={imgRef}
          src={resolvedUrl}
          alt={alt}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-contain block transition-transform duration-500 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}

        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
          {fallbackIcon || <BookOpen size={36} className="text-gray-400" />}
        </div>
      )}

      {badge && (
        <div
          className={`absolute top-2 sm:top-3 left-2 sm:left-3 ${badgeColor} text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-xs pointer-events-none z-10`}
        >
          {badge}
        </div>
      )}
    </div>
  );
}
