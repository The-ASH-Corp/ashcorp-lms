"use client";

import React from "react";
import { motion } from "framer-motion";
import GraduateCard from "./GraduateCard";
import { useGetFeaturedGraduatesQuery } from "@/lib/redux/features/graduate/graduateApi";

export default function Graduates() {
  const { data: featuredGraduates, isLoading } = useGetFeaturedGraduatesQuery();

  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (/^(https?:\/\/|data:image)/i.test(url)) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
    const path = url.replace(/^\/+/, "");
    return `${baseUrl}/${path}`;
  };

  const graduatesList = featuredGraduates || [];
  
  if (!isLoading && graduatesList.length === 0) {
    return null;
  }
  
  // Only enable infinite marquee scrolling if there are 4 or more graduates to scroll
  const shouldScroll = graduatesList.length >= 4;
  const marqueeItems = shouldScroll
    ? [...graduatesList, ...graduatesList]
    : graduatesList;

  return (
    <section className="bg-white py-12 border-b border-purple-50 overflow-hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400">
          Our Graduates Work At
        </p>

        {shouldScroll ? (
          <div
            className="relative mt-10 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
            }}
          >
            <motion.div
              className="flex w-max gap-12"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                ease: "linear",
                duration: Math.max(20, graduatesList.length * 4),
                repeat: Infinity,
              }}
            >
              {marqueeItems.map((item: any, idx: number) => (
                <GraduateCard
                  key={`${item.id || item._id}-${idx}`}
                  name={item.name}
                  position={item.positionName}
                  company={item.positionName}
                  companyLogo={getImageUrl(item.companyLogo)}
                  image={getImageUrl(item.image)}
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {graduatesList.map((item: any, idx: number) => (
              <GraduateCard
                key={item.id || item._id || idx}
                name={item.name}
                position={item.positionName}
                company={item.positionName}
                companyLogo={getImageUrl(item.companyLogo)}
                image={getImageUrl(item.image)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
