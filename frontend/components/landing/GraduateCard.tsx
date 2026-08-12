"use client";

import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';

interface GraduateCardProps {
  image: string | StaticImageData;
}

export default function GraduateCard({
  image,
}: GraduateCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-[21rem] w-[16.5rem] flex-shrink-0 overflow-hidden rounded-[2rem] border border-purple-100/70 shadow-[0_25px_60px_-35px_rgba(76,29,149,0.45)] hover:shadow-[0_30px_70px_-25px_rgba(76,29,149,0.55)] cursor-pointer"
    >
      <Image
        src={image}
        alt="Graduate"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:opacity-0"></div>
    </motion.div>
  );
}
