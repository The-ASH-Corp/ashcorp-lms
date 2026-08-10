"use client";

import React from "react";
import { Sparkles, Power } from "lucide-react";
import { IPrivacyPolicySettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface HeroConfigCardProps {
  hero: IPrivacyPolicySettings["hero"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: IPrivacyPolicySettings["hero"]) => void;
}

export function HeroConfigCard({
  hero,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: HeroConfigCardProps) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Sparkles className="size-4 text-violet-600" />
          Hero Section Config
        </h2>

        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              isVisible
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {isVisible ? "Active" : "Hidden"}
          </button>
        )}
      </div>

      <div
        className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Badge Text
            </label>
            <input
              type="text"
              value={hero?.badgeText || ""}
              onChange={(e) =>
                onChange({ ...hero, badgeText: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="Ash Academy • Privacy & Information"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Last Updated Date
            </label>
            <input
              type="text"
              value={hero?.lastUpdatedDate || ""}
              onChange={(e) =>
                onChange({ ...hero, lastUpdatedDate: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="July 29, 2026"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Headline
          </label>
          <input
            type="text"
            value={hero?.headline || ""}
            onChange={(e) =>
              onChange({ ...hero, headline: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
            placeholder="Privacy Policy"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Description
          </label>
          <textarea
            rows={3}
            value={hero?.description || ""}
            onChange={(e) =>
              onChange({ ...hero, description: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
            placeholder="Your privacy matters to us..."
          />
        </div>
      </div>
    </section>
  );
}
