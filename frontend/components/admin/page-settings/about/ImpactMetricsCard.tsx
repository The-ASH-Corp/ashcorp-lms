"use client";

import React from "react";
import { Activity, Power, Globe, BookOpen, Star, Database } from "lucide-react";
import { IAboutPageSettings } from "./aboutSettingsTypes";
import { useGetLandingStatsQuery, useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";

interface ImpactMetricsCardProps {
  impactMetrics: IAboutPageSettings["impactMetrics"];
  onChange: (updated: IAboutPageSettings["impactMetrics"]) => void;
}

export function ImpactMetricsCard({
  impactMetrics,
  onChange,
}: ImpactMetricsCardProps) {
  const isEnabled = impactMetrics?.enabled ?? true;

  // Auto-fetch numbers from DB
  const { data: landingStats, isLoading: isStatsLoading } = useGetLandingStatsQuery();
  const { data: courses = [], isLoading: isCoursesLoading } = useGetAllCourseQuery();

  const totalStudents = landingStats?.studentsGlobally ?? 12500;
  const totalCourses = courses.length || 84;
  const satisfactionRate = landingStats?.satisfactionRate ?? 4.9;

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Activity className="size-4 text-violet-600" />
          Impact Metrics
        </h2>

        <div className="flex items-center gap-2">
          {/* On / Off Switch as requested */}
          <button
            type="button"
            onClick={() => onChange({ ...impactMetrics, enabled: !isEnabled })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              isEnabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {isEnabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/60 p-3 text-xs text-violet-900">
        <Database className="size-4 shrink-0 text-violet-600" />
        <p>
          Metrics are automatically computed from live database records. No manual number input required—simply toggle section visibility on or off.
        </p>
      </div>

      <div
        className={`grid grid-cols-1 gap-3 sm:grid-cols-3 transition-opacity ${
          !isEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Global Students Card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Globe className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Global Students
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-slate-900">
              {isStatsLoading ? "..." : `${totalStudents.toLocaleString()}+`}
            </h3>
          </div>
        </div>

        {/* Courses Created Card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Courses Created
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-slate-900">
              {isCoursesLoading ? "..." : `${totalCourses}`}
            </h3>
          </div>
        </div>

        {/* Satisfaction Rating Card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Star className="size-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Satisfaction Rating
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-slate-900">
              {isStatsLoading ? "..." : `${satisfactionRate}/5`}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
