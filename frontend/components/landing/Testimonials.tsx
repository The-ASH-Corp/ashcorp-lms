"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import { useGetHomepageSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  hasQuoteIcon?: boolean;
}



const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "AA";

  const first = parts[0]?.[0] ?? "A";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "A") : "A";

  return `${first}${last}`.toUpperCase();
};

export default function Testimonials() {
  const { data: courses = [] } = useGetAllCourseQuery();
  const { data: settings } = useGetHomepageSettingsQuery();
  const testimonialSectionSettings = settings?.testimonialsSection;

  if (testimonialSectionSettings?.enabled === false) {
    return null;
  }

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const dynamicTestimonials = useMemo(() => {
    const mapped = courses
      .flatMap((course) =>
        (course.rating ?? []).map((entry, index) => ({
          id: `${course.id}-${entry.userId}-${index}`,
          quote: entry.review?.trim() || "",
          authorName: entry.userName?.trim() || "Ash Academy Student",
        })),
      )
      .filter((item) => item.quote.length > 0);

    const unique = new Map<string, Testimonial>();
    mapped.forEach((item) => {
      const key = `${item.authorName.toLowerCase()}-${item.quote.toLowerCase()}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });

    return Array.from(unique.values()).slice(0, 18);
  }, [courses]);

  const testimonials = useMemo(() => {
    const adminItems = testimonialSectionSettings?.items
      ?.filter((item) => item.isApproved !== false)
      ?.map((item) => ({
        id: item.id,
        quote: item.quote,
        authorName: item.authorName,
      }));

    if (adminItems && adminItems.length > 0) {
      return [...adminItems, ...dynamicTestimonials];
    }

    return [...dynamicTestimonials];
  }, [testimonialSectionSettings, dynamicTestimonials]);

  const updateScrollState = () => {
    const node = sliderRef.current;
    if (!node) return;

    const left = node.scrollLeft;
    const maxLeft = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(left > 8);
    setCanScrollRight(left < maxLeft - 8);
  };

  useEffect(() => {
    updateScrollState();

    const node = sliderRef.current;
    if (!node) return;

    const onScroll = () => updateScrollState();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [testimonials.length]);

  const scrollCards = (direction: "left" | "right") => {
    const node = sliderRef.current;
    if (!node) return;

    const delta = Math.max(node.clientWidth * 0.85, 340);
    node.scrollBy({
      left: direction === "right" ? delta : -delta,
      behavior: "smooth",
    });
  };

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
              {testimonialSectionSettings?.subtitle || "Testimonials"}
            </p>
            <h2 className="mt-2 max-w-md text-3xl font-bold tracking-tight text-indigo-950">
              {testimonialSectionSettings?.title || "What our Students say about us"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-primary">
              <Quote className="h-4 w-4" />
              Learner feedback
            </div>
            <button
              type="button"
              onClick={() => scrollCards("left")}
              disabled={!canScrollLeft}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-white text-primary transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Scroll testimonials left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCards("right")}
              disabled={!canScrollRight}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-white text-primary transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Scroll testimonials right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          ref={sliderRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
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
              className="relative w-[90vw] max-w-[42rem] shrink-0 snap-start flex flex-col justify-between rounded-3xl border border-purple-100/70 bg-white p-7  sm:w-[34rem] lg:w-[32rem] xl:w-[31rem] shadow-md transition-shadow hover:shadow-lg"
            >
              { (
                <div className="absolute top-6 right-6 text-purple-200 pointer-events-none">
                  <Quote className="h-8 w-8 fill-current" />
                </div>
              )}

              <p className="text-sm font-medium leading-relaxed text-gray-600 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-purple-50 text-xs font-bold tracking-wide text-indigo-900">
                  {getInitials(t.authorName)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-950">
                    {t.authorName}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
