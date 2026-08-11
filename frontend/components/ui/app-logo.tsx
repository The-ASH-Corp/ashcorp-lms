"use client";

import React from "react";
import Image from "next/image";
import { useGetGeneralSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";
import DefaultLogo from "../../public/images/logo.webp";

interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export function AppLogo({ width = 90, height = 90, className = "", alt = "Logo" }: AppLogoProps) {
  const { data: generalSettings, isLoading } = useGetGeneralSettingsQuery();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || '';
  const logoSrc = generalSettings?.logoUrl
    ? `${apiBase}${generalSettings.logoUrl}`
    : DefaultLogo;

  if (isLoading) {
    return (
      <div 
        className={`animate-pulse bg-purple-100 rounded-md ${className}`} 
        style={{ width, height }}
      />
    );
  }

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
