"use client";

import React from "react";
import { motion } from "framer-motion";
import GraduateCard from "./GraduateCard";
import {
  useGetFeaturedGraduatesQuery,
  type Graduate,
} from "@/lib/redux/features/graduate/graduateApi";

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

  const getGraduateKey = (graduate: Graduate, index: number) =>
    graduate.id || graduate._id || `${graduate.name}-${index}`;

  return (
    <section className="overflow-hidden border-b border-purple-50 bg-white py-12 sm:py-14">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
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
              className="flex w-max gap-8"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                ease: "linear",
                duration: Math.max(20, graduatesList.length * 4),
                repeat: Infinity,
              }}
            >
              {marqueeItems.map((item: Graduate, idx: number) => (
                <GraduateCard
                  key={`${getGraduateKey(item, idx)}-${idx}`}
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
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {graduatesList.map((item: Graduate, idx: number) => (
              <GraduateCard
                key={getGraduateKey(item, idx)}
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
