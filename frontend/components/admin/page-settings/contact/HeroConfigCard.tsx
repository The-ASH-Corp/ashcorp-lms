"use client";

import React from "react";
import { LayoutTemplate, Power, PowerOff } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface HeroConfigCardProps {
  hero: IContactPageSettings["hero"];
  isVisible: boolean;
  onToggleVisibility: () => void;
  onChange: (updated: IContactPageSettings["hero"]) => void;
}

export function HeroConfigCard({
  hero,
  isVisible,
  onToggleVisibility,
  onChange,
}: HeroConfigCardProps) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h4 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-900">
          <LayoutTemplate className="size-4 text-violet-600" />
          Hero Section Config
        </h4>

        <button
          onClick={onToggleVisibility}
          className={`flex h-8 items-center gap-2 rounded-full px-3.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
            isVisible
              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }`}
        >
          {isVisible ? (
            <>
              <Power className="size-3.5" /> Visible
            </>
          ) : (
            <>
              <PowerOff className="size-3.5" /> Hidden
            </>
          )}
        </button>
      </div>

      <div
        className={`mt-5 space-y-4 transition-all duration-300 ${
          !isVisible ? "pointer-events-none opacity-40 grayscale" : "opacity-100"
        }`}
      >
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Badge Text
          </label>
          <input
            type="text"
            value={hero?.badgeText || ""}
            onChange={(e) => onChange({ ...hero, badgeText: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
            placeholder="Connect with Us"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Headline
          </label>
          <input
            type="text"
            value={hero?.headline || ""}
            onChange={(e) => onChange({ ...hero, headline: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
            placeholder="Get in Touch with Academic Zenith"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Description
          </label>
          <textarea
            rows={4}
            value={hero?.description || ""}
            onChange={(e) => onChange({ ...hero, description: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
            placeholder="Whether you're a prospective student..."
          />
        </div>
      </div>
    </section>
  );
}
