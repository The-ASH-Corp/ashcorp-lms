"use client";

import React from "react";
import { BarChart3, Users, Award, Star, CheckCircle, Power } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface StatsOrchestrationCardProps {
  stats: IHomepageSettings["stats"];
  onChange: (updatedStats: IHomepageSettings["stats"]) => void;
}

export function StatsOrchestrationCard({
  stats,
  onChange,
}: StatsOrchestrationCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <BarChart3 className="size-4 text-violet-600" />
            Live Stats Strip
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Calculated automatically in real time from database metrics.
          </p>
        </div>

        {/* On/Off Switch */}
        <button
          type="button"
          onClick={() => onChange({ ...stats, enabled: !stats.enabled })}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
            stats.enabled
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Power className="size-3.5" />
          {stats.enabled ? "Section Active" : "Section Hidden"}
        </button>
      </div>

      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 transition-opacity ${!stats.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center">
          <Users className="mx-auto size-4 text-violet-600 mb-1" />
          <p className="text-xs font-medium text-slate-700">Learners</p>
          <p className="text-[10px] text-slate-500">Auto DB Count</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center">
          <Award className="mx-auto size-4 text-violet-600 mb-1" />
          <p className="text-xs font-medium text-slate-700">Mentors</p>
          <p className="text-[10px] text-slate-500">Auto DB Count</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center">
          <CheckCircle className="mx-auto size-4 text-violet-600 mb-1" />
          <p className="text-xs font-medium text-slate-700">Completion</p>
          <p className="text-[10px] text-slate-500">Auto DB Rate</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center">
          <Star className="mx-auto size-4 text-amber-500 fill-amber-400 mb-1" />
          <p className="text-xs font-medium text-slate-700">Rating</p>
          <p className="text-[10px] text-slate-500">Auto DB Rating</p>
        </div>
      </div>
    </section>
  );
}
