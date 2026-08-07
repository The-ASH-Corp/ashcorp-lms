"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Flame, Power } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";

interface TrendingWorkshopsCardProps {
  trendingSection: IHomepageSettings["trendingWorkshops"];
  onChange: (updated: IHomepageSettings["trendingWorkshops"]) => void;
}

export function TrendingWorkshopsCard({
  trendingSection,
  onChange,
}: TrendingWorkshopsCardProps) {
  const { data: courses = [] } = useGetAllCourseQuery();

  const topCourses = [...courses]
    .sort(
      (a, b) =>
        (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0)
    )
    .slice(0, 3);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Flame className="size-4 text-violet-600" />
          Trending Courses Section
        </h2>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/course"
            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition hover:text-violet-700"
          >
            Manage Courses <ArrowUpRight className="size-3.5" />
          </Link>

          {/* On/Off Switch */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...trendingSection,
                enabled: !trendingSection.enabled,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              trendingSection.enabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {trendingSection.enabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <div className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-opacity ${!trendingSection.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Section Subtitle
            </label>
            <input
              type="text"
              value={trendingSection.subtitle || ""}
              onChange={(e) =>
                onChange({ ...trendingSection, subtitle: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="POPULAR WORKSHOPS"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Main Section Title
            </label>
            <input
              type="text"
              value={trendingSection.title || ""}
              onChange={(e) =>
                onChange({ ...trendingSection, title: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="Trending Courses"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Section Description
          </label>
          <input
            type="text"
            value={trendingSection.description || ""}
            onChange={(e) =>
              onChange({ ...trendingSection, description: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500"
            placeholder="The most purchased courses right now."
          />
        </div>

        {/* Top 3 Auto Spotlight Preview */}
        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Top Enrolled Showcase
          </p>
          <div className="space-y-2">
            {topCourses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
              >
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {c.title}
                </span>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>{c.enrolledStudents?.length || 0} students</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-600">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {(
                      (c.rating || []).reduce((acc, r) => acc + r.rating, 0) /
                      (c.rating?.length || 1)
                    ).toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
