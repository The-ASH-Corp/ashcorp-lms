"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950 max-w-md">
            What our creative community says about us
          </h2>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 text-purple-600 hover:bg-purple-50 active:scale-95 transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 text-purple-600 hover:bg-purple-50 active:scale-95 transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col justify-between rounded-3xl border border-purple-50 bg-[#FAF8FC]/40 p-8 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Quote Icon */}
              {t.hasQuoteIcon && (
                <div className="absolute top-6 right-6 text-purple-200 pointer-events-none">
                  <Quote className="h-8 w-8 fill-current" />
                </div>
              )}

              {/* Quote text */}
              <p className="text-sm font-medium leading-relaxed text-gray-600 italic">
                "{t.quote}"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
