"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  hasQuoteIcon?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "The way Ash Academy structures its creative courses is unlike anything I've seen. It feels like a journey rather than just a lecture. Has improved my digital painting skills fold.",
    authorName: "Maya Rodriguez",
    authorRole: "Illustrator & Designer",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    hasQuoteIcon: true,
  },
  {
    id: 2,
    quote: "As a software engineer, I wanted to learn UI design. The approachable, illustrative style of the platform made it so much less intimidating to dive into the creative world.",
    authorName: "James Blake",
    authorRole: "Product Engineer",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  },
  {
    id: 3,
    quote: "I found my dream mentor here. The direct feedback on my motion design projects was exactly what I needed to land my first studio gig. Highly recommended for any creative.",
    authorName: "Luna Avery",
    authorRole: "Motion Designer",
    authorImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <motion.div
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-500">
              Testimonials
            </p>
            <h2 className="mt-2 max-w-md text-3xl font-bold tracking-tight text-indigo-950">
              What our creative community says about us
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-primary">
            <Quote className="h-4 w-4" />
            Learner feedback
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.14,
                delayChildren: 0.08,
              },
            },
          }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.62,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col justify-between rounded-3xl border border-purple-100/70 bg-white p-7 shadow-[0_25px_60px_-45px_rgba(76,29,149,0.35)] transition-shadow hover:shadow-[0_30px_70px_-40px_rgba(76,29,149,0.45)]"
            >
              {/* Quote Icon */}
              {t.hasQuoteIcon && (
                <div className="absolute top-6 right-6 text-purple-200 pointer-events-none">
                  <Quote className="h-8 w-8 fill-current" />
                </div>
              )}

              {/* Quote text */}
              <p className="text-sm font-medium leading-relaxed text-gray-600 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div className="mt-8 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-purple-100">
                  <Image
                    src={t.authorImage}
                    alt={t.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-950">{t.authorName}</h4>
                  <p className="text-xs text-gray-500">{t.authorRole}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
