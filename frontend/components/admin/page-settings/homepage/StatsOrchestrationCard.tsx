"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Power,
  Globe,
  Award,
  Star,
  Database,
  Sliders,
  Sparkles,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { useGetLandingStatsQuery } from "@/lib/redux/features/course/courseApi";
import { toast } from "sonner";

interface StatsOrchestrationCardProps {
  stats: IHomepageSettings["stats"];
  onChange: (updatedStats: IHomepageSettings["stats"]) => void;
}

const formatDisplayStudents = (value: number): string => {
  if (value >= 1000) {
    const inThousands = value / 1000;
    const formatted =
      inThousands % 1 === 0 ? inThousands.toFixed(0) : inThousands.toFixed(1);
    return `${formatted}k+`;
  }
  return `${Math.round(value)}+`;
};

const formatDisplayMentors = (value: number): string => `${Math.round(value)}+`;

const formatDisplayRating = (value: number): string => {
  const clamped = Math.max(0, Math.min(5, value));
  return `${clamped.toFixed(1)}/5`;
};

export function StatsOrchestrationCard({
  stats,
  onChange,
}: StatsOrchestrationCardProps) {
  const isEnabled = stats?.enabled ?? true;
  const currentSource = stats?.source || "db";
  const [copiedDbValues, setCopiedDbValues] = useState(false);

  // Auto-fetch live numbers from DB
  const { data: landingStats, isLoading: isStatsLoading } =
    useGetLandingStatsQuery();

  const liveDbStudents = landingStats?.studentsGlobally ?? 0;
  const liveDbMentors = landingStats?.expertMentors ?? 0;
  const liveDbRating = landingStats?.satisfactionRate ?? 0;

  // Manual / Frontend values with sensible fallbacks
  const studentsCount = stats?.studentsCount ?? 26;
  const studentsLabel = stats?.studentsLabel ?? "Students Globally";
  const mentorsCount = stats?.mentorsCount ?? 12;
  const mentorsLabel = stats?.mentorsLabel ?? "Expert Mentors";
  const rating = stats?.rating ?? 0.0;
  const ratingLabel = stats?.ratingLabel ?? "Satisfaction Rate";

  const handleSourceChange = (newSource: "db" | "frontend") => {
    onChange({
      ...stats,
      source: newSource,
    });
  };

  const handleCopyDbToManual = () => {
    onChange({
      ...stats,
      source: "frontend",
      studentsCount: liveDbStudents,
      mentorsCount: liveDbMentors,
      rating: liveDbRating,
    });
    setCopiedDbValues(true);
    toast.success("Live DB values copied to frontend input fields!");
    setTimeout(() => setCopiedDbValues(false), 2500);
  };

  // Preview values depending on selected source
  const isFrontendActive =
    currentSource === "frontend" || currentSource === "manual";
  const previewStudents = isFrontendActive
    ? formatDisplayStudents(studentsCount)
    : formatDisplayStudents(liveDbStudents);
  const previewMentors = isFrontendActive
    ? formatDisplayMentors(mentorsCount)
    : formatDisplayMentors(liveDbMentors);
  const previewRating = isFrontendActive
    ? formatDisplayRating(rating)
    : formatDisplayRating(liveDbRating);

  return (
    <section className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
              <BarChart3 className="size-4 text-violet-600" />
              Homepage Stats Strip
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure whether stats render live database statistics or custom values added via the frontend.
            </p>
          </div>

          {/* Section Visibility Switch */}
          <button
            type="button"
            onClick={() => onChange({ ...stats, enabled: !isEnabled })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              isEnabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {isEnabled ? "Section Active" : "Section Hidden"}
          </button>
        </div>

        {/* DATA SOURCE SWITCHER */}
        <div className="mt-5 rounded-2xl border border-violet-100 bg-slate-50/80 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Database className="size-3.5 text-violet-600" />
                Data Source Switcher
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Switch which dataset the public Homepage stats strip will render.
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
                Live DB Data
                {!isFrontendActive && (
                  <span className="size-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSourceChange("frontend")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isFrontendActive
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sliders className="size-3.5" />
                Frontend / Custom Data
                {isFrontendActive && (
                  <span className="size-2 rounded-full bg-violet-500" />
                )}
              </button>
            </div>
          </div>

          {/* Active status indicator banner */}
          <div
            className={`mt-4 flex items-center justify-between rounded-xl p-3 text-xs border ${
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
                    ? "Frontend Data Mode Active:"
                    : "Live Database Mode Active:"}
                </strong>{" "}
                {isFrontendActive
                  ? "The Homepage is rendering custom metrics added and saved via frontend inputs."
                  : "The Homepage is rendering auto-computed numbers directly from MongoDB records."}
              </p>
            </div>

            {!isFrontendActive && (
              <button
                type="button"
                onClick={handleCopyDbToManual}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-50 cursor-pointer shadow-2xs shrink-0 ml-3"
              >
                {copiedDbValues ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy DB Values to Frontend
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONDITIONAL CONTENT: LIVE DB STATS VIEW */}
      {!isFrontendActive && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Database className="size-4 text-emerald-600" />
                Current Live Database Metrics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These numbers update automatically in real-time as users register and courses are reviewed.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyDbToManual}
              className="inline-flex sm:hidden items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700"
            >
              <Copy className="size-3" />
              Copy to Frontend
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Students Card */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-2xs">
              <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600 shrink-0">
                <Globe className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Global Students (DB)
                </p>
                <h4 className="mt-0.5 text-xl font-bold text-slate-900">
                  {isStatsLoading
                    ? "..."
                    : formatDisplayStudents(liveDbStudents)}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Raw count: {liveDbStudents.toLocaleString()} registered users
                </p>
              </div>
            </div>

            {/* Expert Mentors Card */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-2xs">
              <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600 shrink-0">
                <Award className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Expert Mentors (DB)
                </p>
                <h4 className="mt-0.5 text-xl font-bold text-slate-900">
                  {isStatsLoading ? "..." : formatDisplayMentors(liveDbMentors)}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Raw count: {liveDbMentors} active instructors
                </p>
              </div>
            </div>

            {/* Satisfaction Rating Card */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-2xs">
              <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-500 shrink-0">
                <Star className="size-5 fill-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Satisfaction Rate (DB)
                </p>
                <h4 className="mt-0.5 text-xl font-bold text-slate-900">
                  {isStatsLoading
                    ? "..."
                    : formatDisplayRating(liveDbRating)}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Raw rating: {liveDbRating} / 5.0
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FRONTEND / MANUAL EDITING FORM */}
      <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sliders className="size-4 text-violet-600" />
              Frontend Custom Data Editor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the exact values and labels rendered on the Homepage when &quot;Frontend Data&quot; mode is active.
            </p>
          </div>

          {isFrontendActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[11px] font-bold text-violet-700">
              <Sparkles className="size-3" />
              Currently Active
            </span>
          ) : (
            <button
              type="button"
              onClick={() => handleSourceChange("frontend")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Switch To This Mode
            </button>
          )}
        </div>

        {/* 3 Metrics Inputs Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* 1. Students Metric */}
          <div className="rounded-2xl border border-violet-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
                <Globe className="size-3.5" />
                Metric 1 (Students)
              </span>
              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                Preview: {formatDisplayStudents(studentsCount)}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Value / Count
              </label>
              <input
                type="number"
                min={0}
                value={studentsCount}
                onChange={(e) =>
                  onChange({
                    ...stats,
                    studentsCount: Number(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="26"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Values &ge; 1,000 auto-format with &quot;k+&quot; (e.g. 15,000 &rarr; 15k+)
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Display Label
              </label>
              <input
                type="text"
                value={studentsLabel}
                onChange={(e) =>
                  onChange({
                    ...stats,
                    studentsLabel: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Students Globally"
              />
            </div>
          </div>

          {/* 2. Expert Mentors Metric */}
          <div className="rounded-2xl border border-violet-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
                <Award className="size-3.5" />
                Metric 2 (Mentors)
              </span>
              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                Preview: {formatDisplayMentors(mentorsCount)}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Value / Count
              </label>
              <input
                type="number"
                min={0}
                value={mentorsCount}
                onChange={(e) =>
                  onChange({
                    ...stats,
                    mentorsCount: Number(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="12"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Rendered with trailing &quot;+&quot; (e.g. 12 &rarr; 12+)
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Display Label
              </label>
              <input
                type="text"
                value={mentorsLabel}
                onChange={(e) =>
                  onChange({
                    ...stats,
                    mentorsLabel: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Expert Mentors"
              />
            </div>
          </div>

          {/* 3. Satisfaction Rating Metric */}
          <div className="rounded-2xl border border-violet-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                Metric 3 (Rating)
              </span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Preview: {formatDisplayRating(rating)}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Rating Score (0.0 to 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={rating}
                onChange={(e) =>
                  onChange({
                    ...stats,
                    rating: Number(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="4.9"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Clamped between 0.0 and 5.0, formatted with &quot;/5&quot;
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Display Label
              </label>
              <input
                type="text"
                value={ratingLabel}
                onChange={(e) =>
                  onChange({
                    ...stats,
                    ratingLabel: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Satisfaction Rate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW SECTION (Matching Public Homepage Exact Banner) */}
      <div className="rounded-3xl border border-violet-200 bg-linear-to-b from-white to-violet-50/30 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-violet-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-violet-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Preview on Public Homepage
            </h4>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-semibold ${
              isFrontendActive
                ? "bg-violet-100 text-violet-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isFrontendActive
              ? "Rendering: Frontend Custom Data"
              : "Rendering: Live DB Data"}
          </span>
        </div>

        {/* Public rendered view banner mockup */}
        <div className="rounded-[2rem] bg-primary px-6 py-8 text-white shadow-xl shadow-purple-100 sm:px-12 md:py-10">
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-y-0 md:divide-x md:divide-purple-500/40">
            <div className="text-center md:px-4">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {previewStudents}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                {isFrontendActive ? studentsLabel : "Students Globally"}
              </p>
            </div>

            <div className="text-center md:px-4">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {previewMentors}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                {isFrontendActive ? mentorsLabel : "Expert Mentors"}
              </p>
            </div>

            <div className="text-center md:px-4">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {previewRating}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                {isFrontendActive ? ratingLabel : "Satisfaction Rate"}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
          Tip: Remember to click &quot;Publish Changes&quot; in the header bar above to save your updates to the database.
        </p>
      </div>
    </section>
  );
}
