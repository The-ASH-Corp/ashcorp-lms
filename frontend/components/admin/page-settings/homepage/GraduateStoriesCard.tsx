"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowUpRight, Power } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface GraduateStoriesCardProps {
  graduatesSection: IHomepageSettings["graduates"];
  onChange: (updated: IHomepageSettings["graduates"]) => void;
}

export function GraduateStoriesCard({
  graduatesSection,
  onChange,
}: GraduateStoriesCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <GraduationCap className="size-4 text-violet-600" />
          Graduate Spotlight Section
        </h2>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/graduates"
            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition hover:text-violet-700"
          >
            Manage Graduates <ArrowUpRight className="size-3.5" />
          </Link>

          {/* On/Off Switch */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...graduatesSection,
                enabled: !graduatesSection.enabled,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              graduatesSection.enabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {graduatesSection.enabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <div className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-opacity ${!graduatesSection.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Section Subtitle
            </label>
            <input
              type="text"
              value={graduatesSection.subtitle || ""}
              onChange={(e) =>
                onChange({ ...graduatesSection, subtitle: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="GRADUATES & ALUMNI"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Main Section Title
            </label>
            <input
              type="text"
              value={graduatesSection.title || ""}
              onChange={(e) =>
                onChange({ ...graduatesSection, title: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="Our Alumni Work at World-Class Companies"
            />
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-xs text-violet-900">
          💡 <strong>Tip:</strong> Individual graduate cards and company logos can be added, updated, or featured on the landing page via the{" "}
          <Link href="/admin/graduates" className="underline font-semibold">
            Graduates Management Page
          </Link>
          .
        </div>
      </div>
    </section>
  );
}
