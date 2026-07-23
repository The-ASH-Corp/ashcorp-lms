"use client";

import React from "react";
import { motion } from "framer-motion";
import GraduateCard from "./GraduateCard";
import { useGetFeaturedGraduatesQuery } from "@/lib/redux/features/graduate/graduateApi";

import student1 from "../../public/screen.png";
import student2 from "../../public/screen1.png";
import student3 from "../../public/screen2.png";

import companyLogo1 from "../../public/logo.png";
import companyLogo2 from "../../public/logo2.png";
import companyLogo3 from "../../public/logo3.png";

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

  const hasFeatured = featuredGraduates && featuredGraduates.length > 0;
  const marqueeItems = hasFeatured
    ? [...featuredGraduates, ...featuredGraduates]
    : [];

  return (
    <section className="bg-white py-12 border-b border-purple-50 overflow-hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400">
          Our Graduates Work At
        </p>

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
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeItems.map((item: any, idx: number) => {
              if (hasFeatured) {
                return (
                  <GraduateCard
                    key={`${item.id || item._id}-${idx}`}
                    name={item.name}
                    position={item.positionName}
                    company={item.positionName}
                    companyLogo={getImageUrl(item.companyLogo)}
                    image={getImageUrl(item.image)}
                  />
                );
              }

              return (
                <GraduateCard
                  key={idx}
                  name={item.name}
                  position={item.position}
                  company={item.company}
                  companyLogo={item.companyLogo}
                  image={item.image}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
