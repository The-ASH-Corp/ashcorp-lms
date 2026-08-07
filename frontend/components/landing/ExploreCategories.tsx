"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paintbrush,
  Code,
  Play,
  PenTool,
  Rocket,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Palette,
  Database,
  Shield,
  Cloud,
} from "lucide-react";
import { useGetAllCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import { useGetHomepageSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns true if the hex colour is perceived as "light" */
const isLightColor = (hex?: string): boolean => {
  if (!hex || !hex.startsWith("#")) return true;
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return true;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

const hexToRgba = (hex: string, alpha: number): string => {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return `rgba(79,70,229,${alpha})`;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const getCategoryIcon = (name: string, cls = "h-5 w-5") => {
  const l = name.toLowerCase();
  if (l.includes("flutter") || l.includes("mobile") || l.includes("app")) return <Code className={cls} />;
  if (l.includes("design") || l.includes("art") || l.includes("illustrat")) return <Paintbrush className={cls} />;
  if (l.includes("code") || l.includes("dev") || l.includes("web") || l.includes("program")) return <Code className={cls} />;
  if (l.includes("motion") || l.includes("video") || l.includes("animat")) return <Play className={cls} />;
  if (l.includes("write") || l.includes("content") || l.includes("copy")) return <PenTool className={cls} />;
  if (l.includes("ai") || l.includes("machine") || l.includes("brain")) return <BrainCircuit className={cls} />;
  if (l.includes("ui") || l.includes("ux") || l.includes("product")) return <Palette className={cls} />;
  if (l.includes("business") || l.includes("market") || l.includes("startup")) return <Rocket className={cls} />;
  if (l.includes("data") || l.includes("science") || l.includes("analytics")) return <Database className={cls} />;
  if (l.includes("security") || l.includes("cyber")) return <Shield className={cls} />;
  if (l.includes("cloud") || l.includes("devops") || l.includes("infra")) return <Cloud className={cls} />;
  return <Sparkles className={cls} />;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SmallCardProps {
  _id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  courseCount: number;
  animationDelay?: number;
}

/** Compact square card used in the bento grid */
function SmallCard({ categoryName, color, iconUrl, courseCount, animationDelay = 0 }: SmallCardProps) {
  const accent = color || "#4F46E5";
  const bg = hexToRgba(accent, 0.11);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.32, delay: animationDelay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative flex min-h-[136px] flex-col justify-between rounded-3xl p-5 cursor-pointer"
      style={{ backgroundColor: bg }}
    >
      {/* Category name */}
      <h3 className="text-lg font-bold text-indigo-950 leading-snug pr-8">
        {categoryName}
      </h3>

      {/* Bottom row: count + icon */}
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: accent }}>
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
        <div style={{ color: accent }} className="opacity-75 group-hover:opacity-100 transition-opacity">
          {iconUrl && /^https?:\/\//.test(iconUrl) ? (
            <span className="relative block h-6 w-6">
              <Image src={iconUrl} alt={categoryName} fill className="object-contain" unoptimized />
            </span>
          ) : (
            getCategoryIcon(categoryName, "h-6 w-6")
          )}
        </div>
      </div>

      {/* Full-card clickable link */}
      <Link
        href={`/courses?category=${encodeURIComponent(categoryName)}`}
        className="absolute inset-0 z-10 rounded-3xl"
        aria-label={`Explore ${categoryName}`}
      />
    </motion.div>
  );
}

/** Wide landscape card used in the expanded "View All" section */
function WideCard({ categoryName, color, iconUrl, courseCount, animationDelay = 0 }: SmallCardProps) {
  const accent = color || "#4F46E5";
  const bg = hexToRgba(accent, 0.10);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.34, delay: animationDelay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="group relative flex flex-col justify-between rounded-3xl p-6 cursor-pointer"
      style={{ backgroundColor: bg, minHeight: "156px" }}
    >
      {/* Category name — large, top */}
      <h3 className="text-xl font-bold text-indigo-950 leading-snug">
        {categoryName}
      </h3>

      {/* Bottom row: course count + icon */}
      <div className="flex items-end justify-between mt-6">
        <span
          className="text-sm font-semibold"
          style={{ color: accent }}
        >
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
        <div
          style={{ color: accent }}
          className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
        >
          {iconUrl && /^https?:\/\//.test(iconUrl) ? (
            <span className="relative block h-7 w-7">
              <Image src={iconUrl} alt={categoryName} fill className="object-contain" unoptimized />
            </span>
          ) : (
            getCategoryIcon(categoryName, "h-7 w-7")
          )}
        </div>
      </div>

      {/* Full-card link */}
      <Link
        href={`/courses?category=${encodeURIComponent(categoryName)}`}
        className="absolute inset-0 z-10 rounded-3xl"
        aria-label={`Explore ${categoryName}`}
      />
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ExploreCategories() {
  const [showAll, setShowAll] = useState(false);

  const { data: categories, isLoading } = useGetAllCategoriesQuery();
  const { data: courses } = useGetAllCourseQuery();
  const { data: settings } = useGetHomepageSettingsQuery();
  const catSettings = settings?.categories;

  if (catSettings?.enabled === false) {
    return null;
  }

  const getCourseCount = (catId: string, catName: string): number => {
    if (!courses) return 0;
    return courses.filter((course) => {
      const cat = course.category;
      if (!cat) return false;
      if (typeof cat === "string")
        return cat === catId || cat.toLowerCase() === catName.toLowerCase();
      if (typeof cat === "object" && cat !== null)
        return (
          (cat as { _id?: string })._id === catId ||
          (cat as { categoryName?: string }).categoryName?.toLowerCase() === catName.toLowerCase()
        );
      return false;
    }).length;
  };

  // Bento: first cat = featured large card (row-span-2)
  // next up to 4 cats fill the 2×2 right-side slots naturally via CSS grid auto-placement
  const featuredCat = categories?.[0];
  const bentoSmallCats = categories?.slice(1, 5) ?? [];
  // Remaining (5th cat onwards): revealed when "View All Categories" is clicked
  const remainingCats = categories?.slice(5) ?? [];
  const hasMore = remainingCats.length > 0;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">

        {/* ── Header ── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-indigo-950">
              {catSettings?.title || "Explore Categories"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {catSettings?.description || "Hand-picked creative pathways just for you."}
            </p>
          </div>

          {/* Keep "View All Categories" button - only visible when there are more */}
          {hasMore && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-purple-700 transition-colors cursor-pointer"
            >
              {showAll ? "Show Less" : "View All Categories"}
              <motion.span
                animate={{ rotate: showAll ? 90 : 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </button>
          )}
        </div>

        {/* ── Loading Skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:row-span-2 min-h-[316px] animate-pulse rounded-3xl bg-indigo-100" />
            <div className="min-h-[148px] animate-pulse rounded-3xl bg-gray-100" />
            <div className="min-h-[148px] animate-pulse rounded-3xl bg-gray-100" />
          </div>
        )}

        {/* ── Bento Grid (top 3 categories — always visible) ── */}
        {!isLoading && categories && (
          <>
            <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* ── Featured Large Card (first category) ── */}
              {featuredCat && (() => {
                const darkBg = !isLightColor(featuredCat.color)
                  ? featuredCat.color
                  : "#1E1B4B";
                const courseCount = getCourseCount(featuredCat._id, featuredCat.categoryName);

                return (
                  <motion.div
                    key={featuredCat._id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative flex min-h-[288px] flex-col justify-between overflow-hidden rounded-3xl p-7 cursor-pointer md:row-span-2"
                    style={{ backgroundColor: darkBg }}
                  >
                    {/* Decorative glowing blobs */}
                    <div className="absolute -top-14 -right-14 h-52 w-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    {/* Top right: glass icon badge */}
                    <div className="relative z-10 flex justify-end">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-white">
                        {featuredCat.iconUrl && /^https?:\/\//.test(featuredCat.iconUrl) ? (
                          <span className="relative block h-6 w-6">
                            <Image
                              src={featuredCat.iconUrl}
                              alt={featuredCat.categoryName}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </span>
                        ) : (
                          getCategoryIcon(featuredCat.categoryName, "h-5 w-5")
                        )}
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="relative z-10">
                      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/50 mb-2">
                        Hot Category
                      </p>
                      <h3 className="text-2xl font-extrabold text-white leading-tight mb-5">
                        {featuredCat.categoryName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2">
                        {featuredCat.details && (
                          <span className="inline-block rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-medium text-white/85">
                            {featuredCat.details.length > 28
                              ? featuredCat.details.slice(0, 28) + "…"
                              : featuredCat.details}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-white/65">
                          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
                        </span>
                      </div>
                    </div>

                    {/* Full-card link overlay */}
                    <Link
                      href={`/courses?category=${encodeURIComponent(featuredCat.categoryName)}`}
                      className="absolute inset-0 z-20"
                      aria-label={`Explore ${featuredCat.categoryName}`}
                    />
                  </motion.div>
                );
              })()}

              {/* ── Bento Small Cards (2nd & 3rd categories) ── */}
              {bentoSmallCats.map((cat, i) => (
                <SmallCard
                  key={cat._id}
                  {...cat}
                  courseCount={getCourseCount(cat._id, cat.categoryName)}
                  animationDelay={(i + 1) * 0.09}
                />
              ))}
            </motion.div>

            {/* ── Expanded Section: remaining categories (5th+) in wide 2-col landscape cards ── */}
            <AnimatePresence>
              {showAll && remainingCats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  {remainingCats.map((cat, i) => (
                    <WideCard
                      key={cat._id}
                      {...cat}
                      courseCount={getCourseCount(cat._id, cat.categoryName)}
                      animationDelay={i * 0.07}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
