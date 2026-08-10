"use client";

import React from "react";
import { Sparkles, Power } from "lucide-react";
import { IAboutPageSettings } from "./aboutSettingsTypes";

interface PrimaryNarrativeCardProps {
  hero: IAboutPageSettings["hero"];
  onChange: (updated: IAboutPageSettings["hero"]) => void;
}

export function PrimaryNarrativeCard({
  hero,
  onChange,
}: PrimaryNarrativeCardProps) {
  const isEnabled = hero?.enabled ?? true;

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Sparkles className="size-4 text-violet-600" />
          Primary Narrative (Hero)
        </h2>

        <button
          type="button"
          onClick={() => onChange({ ...hero, enabled: !isEnabled })}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
            isEnabled
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Power className="size-3.5" />
          {isEnabled ? "Active" : "Hidden"}
        </button>
      </div>

      <p className="mb-4 text-xs text-slate-500">
        Manage the main headline and introductory story presented at the top of the About page.
      </p>

      <div
        className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Main Headline
          </label>
          <input
            type="text"
            value={hero?.mainHeadline || ""}
            onChange={(e) => onChange({ ...hero, mainHeadline: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
            placeholder="Forging the Future of Technical Excellence"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Body Narrative
          </label>
          <textarea
            rows={4}
            value={hero?.bodyNarrative || ""}
            onChange={(e) => onChange({ ...hero, bodyNarrative: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
            placeholder="Write the founding story and core mission..."
          />
        </div>
      </div>
    </section>
  );
}
