"use client";

import React from "react";
import { Sparkles, Tag, Plus, Trash2, Power } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface HeroOrchestrationCardProps {
  hero: IHomepageSettings["hero"];
  onChange: (updatedHero: IHomepageSettings["hero"]) => void;
}

export function HeroOrchestrationCard({
  hero,
  onChange,
}: HeroOrchestrationCardProps) {
  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    onChange({
      ...hero,
      tags: [...(hero.tags || []), newTag.trim()],
    });
    setNewTag("");
  };

  const handleRemoveTag = (index: number) => {
    const updated = [...(hero.tags || [])];
    updated.splice(index, 1);
    onChange({ ...hero, tags: updated });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Sparkles className="size-4 text-violet-600" />
          Hero Orchestration
        </h2>
        
        {/* On/Off Switch */}
        <button
          type="button"
          onClick={() => onChange({ ...hero, enabled: !hero.enabled })}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
            hero.enabled
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Power className="size-3.5" />
          {hero.enabled ? "Section Active" : "Section Hidden"}
        </button>
      </div>

      <div className={`space-y-4 rounded-2xl border border-violet-100 bg-linear-to-b from-violet-50/50 to-white p-4 transition-opacity ${!hero.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        {/* Top Badge */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Top Badge Text
          </label>
          <input
            type="text"
            value={hero.badgeText || ""}
            onChange={(e) => onChange({ ...hero, badgeText: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="Creative learning for builders"
          />
        </div>

        {/* Main Headline & Highlight */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Main Headline Lead
            </label>
            <input
              type="text"
              value={hero.mainHeadline || ""}
              onChange={(e) => onChange({ ...hero, mainHeadline: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="Master the Art of"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Highlighted Headline Phrase
            </label>
            <input
              type="text"
              value={hero.headlineHighlight || ""}
              onChange={(e) =>
                onChange({ ...hero, headlineHighlight: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-violet-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="Creative Learning"
            />
          </div>
        </div>

        {/* Subheadline */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Subheadline Description
          </label>
          <textarea
            rows={2}
            value={hero.subHeadline || ""}
            onChange={(e) => onChange({ ...hero, subHeadline: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="Join 1k+ students building the future through design, code..."
          />
        </div>

        {/* Search Placeholder */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Search Bar Placeholder
          </label>
          <input
            type="text"
            value={hero.searchPlaceholder || ""}
            onChange={(e) =>
              onChange({ ...hero, searchPlaceholder: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="What do you want to learn today?"
          />
        </div>

        {/* Feature Tags */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Feature Tags
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {(hero.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-800 shadow-xs"
              >
                <Tag className="size-3 text-violet-500" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="size-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tag (e.g. Design tracks)..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center gap-1 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700"
            >
              <Plus className="size-3" /> Add
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
