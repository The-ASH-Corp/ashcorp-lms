"use client";

import React from "react";
import { Star, Database, Sliders, Sparkles, Copy, Check, Eye, Users } from "lucide-react";
import { toast } from "sonner";

export interface CourseRatingConfig {
  ratingSource: "db" | "admin";
  staticRating: number;
  staticRatingCount?: number;
  staticEnrolledCount?: number;
}

interface CourseRatingConfigCardProps {
  value: CourseRatingConfig;
  onChange: (updated: CourseRatingConfig) => void;
  dbRating?: number;
  dbReviewsCount?: number;
  dbEnrolledCount?: number;
  courseTitle?: string;
}

export function CourseRatingConfigCard({
  value,
  onChange,
  dbRating = 0,
  dbReviewsCount = 0,
  dbEnrolledCount = 0,
  courseTitle,
}: CourseRatingConfigCardProps) {
  const [copiedDbValues, setCopiedDbValues] = React.useState(false);
  const isFrontendActive = value.ratingSource === "admin";

  const handleSourceChange = (newSource: "db" | "admin") => {
    onChange({
      ...value,
      ratingSource: newSource,
    });
  };

  const handleCopyDbToStatic = () => {
    onChange({
      ...value,
      ratingSource: "admin",
      staticRating: Number(dbRating.toFixed(1)),
      staticRatingCount: dbReviewsCount,
      staticEnrolledCount: dbEnrolledCount,
    });
    setCopiedDbValues(true);
    toast.success("Live DB rating and enrolled values copied to static fields!");
    setTimeout(() => setCopiedDbValues(false), 2500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const fillPercentage = Math.max(
        0,
        Math.min(100, Math.round((rating - i) * 100)),
      );

      return (
        <span key={i} className="relative inline-block size-4 shrink-0">
          <Star size={16} className="text-slate-200" />
          {fillPercentage > 0 && (
            <span
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={16}
                className="fill-amber-400 text-amber-400 shrink-0 min-w-[16px]"
              />
            </span>
          )}
        </span>
      );
    });
  };

  const previewRating = isFrontendActive ? value.staticRating : dbRating;
  const previewCount = isFrontendActive
    ? value.staticRatingCount ?? 0
    : dbReviewsCount;
  const previewEnrolled = isFrontendActive
    ? value.staticEnrolledCount ?? 0
    : dbEnrolledCount;

  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Star className="size-4 text-amber-500 fill-amber-400" />
            Course Rating Configuration
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Choose whether {courseTitle ? `"${courseTitle}"` : "this course"} displays ratings calculated from actual database reviews or a custom rating set by the admin.
          </p>
        </div>

        {isFrontendActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 self-start sm:self-auto shrink-0">
            <Sparkles className="size-3" />
            Admin Static Mode
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 self-start sm:self-auto shrink-0">
            <Database className="size-3" />
            Live DB Mode
          </span>
        )}
      </div>

      {/* DATA SOURCE SWITCHER */}
      <div className="rounded-2xl border border-violet-100 bg-slate-50/80 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Database className="size-3.5 text-violet-600" />
              Rating Data Source Switcher
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Select which rating dataset will be shown to public students.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 shrink-0 self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => handleSourceChange("db")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                !isFrontendActive
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Database className="size-3.5" />
              Live DB Rating
              {!isFrontendActive && (
                <span className="size-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSourceChange("admin")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isFrontendActive
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="size-3.5" />
              Admin Static Rating
              {isFrontendActive && (
                <span className="size-2 rounded-full bg-violet-500" />
              )}
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-3 text-xs border gap-3 ${
            isFrontendActive
              ? "border-violet-200 bg-violet-50 text-violet-900"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full shrink-0 ${
                isFrontendActive
                  ? "bg-violet-600 animate-pulse"
                  : "bg-emerald-600 animate-pulse"
              }`}
            />
            <p>
              <strong className="font-semibold">
                {isFrontendActive
                  ? "Admin Static Rating Active:"
                  : "Live Database Rating Active:"}
              </strong>{" "}
              {isFrontendActive
                ? "The course card, details page, and landing strip will display your custom static score."
                : "The course will display the real-time average calculated from actual student reviews in MongoDB."}
            </p>
          </div>

          {!isFrontendActive && (
            <button
              type="button"
              onClick={handleCopyDbToStatic}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-50 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
            >
              {copiedDbValues ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  Copy DB Rating to Static
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* METRICS VIEW */}
      {!isFrontendActive ? (
        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <div className="grid size-12 place-items-center rounded-xl bg-amber-50 text-amber-500 shrink-0">
            <Star className="size-6 fill-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Live Database Data (Auto-Calculated)
            </p>
            <h4 className="mt-0.5 text-xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
              {dbRating.toFixed(1)} / 5.0
              <span className="text-xs font-normal text-slate-500">
                ({dbReviewsCount} student {dbReviewsCount === 1 ? "review" : "reviews"})
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                <Users className="size-3.5" />
                {dbEnrolledCount} Enrolled
              </span>
            </h4>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(dbRating)}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              This course is currently reading real-time ratings, reviews, and student enrollments directly from MongoDB. No manual editing required.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-2xs">
            <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-500 shrink-0">
              <Star className="size-5 fill-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Live DB Reference
              </p>
              <h4 className="mt-0.5 text-base font-bold text-slate-900 flex flex-wrap items-center gap-1.5">
                {dbRating.toFixed(1)} / 5.0
                <span className="text-xs font-normal text-slate-400">
                  ({dbReviewsCount} reviews)
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-600 inline-flex items-center gap-0.5">
                  <Users className="size-3" />
                  {dbEnrolledCount} enrolled
                </span>
              </h4>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(dbRating)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-violet-200 bg-violet-50/50 p-4 shadow-2xs">
            <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600 shrink-0">
              <Sliders className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                Admin Static Rating & Enrolled (Active)
              </p>
              <h4 className="mt-0.5 text-base font-bold text-slate-900 flex flex-wrap items-center gap-1.5">
                {Number(value.staticRating || 0).toFixed(1)} / 5.0
                <span className="text-xs font-normal text-slate-400">
                  ({value.staticRatingCount ?? 0} ratings)
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-semibold text-violet-700 inline-flex items-center gap-0.5">
                  <Users className="size-3" />
                  {value.staticEnrolledCount ?? 0} enrolled
                </span>
              </h4>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(Number(value.staticRating || 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATIC RATING & ENROLLED INPUTS - ONLY visible when Admin Static Mode is active */}
      {isFrontendActive && (
        <div className="rounded-2xl border border-violet-100 bg-slate-50/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="size-3.5 text-violet-600" />
              Edit Static Rating, Reviews & Enrolled Count
            </h4>
            <span className="text-[11px] font-medium text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-md">
              Admin Custom Values
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Static Rating Score (0.0 to 5.0)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  value={value.staticRating}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      staticRating: Math.max(0, Math.min(5, Number(e.target.value) || 0)),
                    })
                  }
                  placeholder="4.8"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <span className="absolute right-3.5 top-2 text-xs text-slate-400 font-medium pointer-events-none">
                  / 5.0
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                e.g. 4.8. Clamped 0.0 to 5.0.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Static Ratings / Review Count
              </label>
              <input
                type="number"
                min={0}
                value={value.staticRatingCount ?? 0}
                onChange={(e) =>
                  onChange({
                    ...value,
                    staticRatingCount: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="25"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Total reviews displayed (e.g. &quot;(25 Ratings)&quot;).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Users className="size-3 text-violet-600" />
                Static Enrolled Students Count
              </label>
              <input
                type="number"
                min={0}
                value={value.staticEnrolledCount ?? 0}
                onChange={(e) =>
                  onChange({
                    ...value,
                    staticEnrolledCount: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="150"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Enrolled count shown on course details and cards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW OF PUBLIC CARD */}
      <div className="rounded-2xl border border-violet-100 bg-linear-to-b from-white to-violet-50/20 p-4">
        <div className="flex items-center justify-between border-b border-violet-50 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Eye className="size-3.5 text-violet-600" />
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Student View Preview
            </h5>
          </div>
          <span className="text-[10px] font-semibold text-violet-700">
            Rendering: {isFrontendActive ? "Admin Static Mode" : "Live DB Mode"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-0.5">
            {renderStars(previewRating)}
          </div>
          <span className="text-xs font-bold text-slate-800">
            {previewRating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">
            ({previewCount} {previewCount === 1 ? "Rating" : "Ratings"})
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1">
            <Users className="size-3.5 text-slate-500" />
            {previewEnrolled} Enrolled
          </span>
        </div>
      </div>
    </div>
  );
}

