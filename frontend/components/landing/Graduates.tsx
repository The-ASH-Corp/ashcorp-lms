"use client";

import React from "react";
import { motion } from "framer-motion";
import GraduateCard from "./GraduateCard";
import {
  useGetFeaturedGraduatesQuery,
  type Graduate,
} from "@/lib/redux/features/graduate/graduateApi";
import { useGetHomepageSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

export default function Graduates() {
  const { data: featuredGraduates, isLoading } = useGetFeaturedGraduatesQuery();
  const { data: settings } = useGetHomepageSettingsQuery();
  const graduateSettings = settings?.graduates;

  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (/^(https?:\/\/|data:image)/i.test(url)) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
    const path = url.replace(/^\/+/, "");
    return `${baseUrl}/${path}`;
  };

  const graduatesList = featuredGraduates || [];

  if (
    graduateSettings?.enabled === false ||
    (!isLoading && graduatesList.length === 0)
  ) {
    return null;
  }

  // Only enable infinite marquee scrolling if there are 4 or more graduates to scroll
  const shouldScroll = graduatesList.length >= 4;
  const marqueeItems = shouldScroll
    ? [...graduatesList, ...graduatesList]
    : graduatesList;

  const getGraduateKey = (graduate: Graduate, index: number) =>
    graduate.id || graduate._id || `grad-${index}`;

  return (
    <section className="overflow-hidden border-b border-purple-50 bg-white py-12 sm:py-14">
      <div className="mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-12 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            {graduateSettings?.subtitle || "Our Graduates Work At"}
          </p>
        </motion.div>

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
              whileHover={{ animationPlayState: "paused" }}
            >
              {marqueeItems.map((item: Graduate, idx: number) => (
                <GraduateCard
                  key={`${getGraduateKey(item, idx)}-${idx}`}
                  image={getImageUrl(item.image)}
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            {graduatesList.map((item: Graduate, idx: number) => (
              <motion.div
                key={getGraduateKey(item, idx)}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 300, damping: 24 },
                  },
                }}
              >
                <GraduateCard
                  image={getImageUrl(item.image)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
