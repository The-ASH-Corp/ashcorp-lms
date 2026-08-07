"use client";

import React from "react";
import {
  Sliders,
  Sparkles,
  BarChart3,
  Grid,
  Flame,
  GraduationCap,
  MessageSquareQuote,
  PanelBottom,
} from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface SectionVisibilityCardProps {
  settings: Partial<IHomepageSettings>;
  onChange: (updated: Partial<IHomepageSettings>) => void;
}

export function SectionVisibilityCard({
  settings,
  onChange,
}: SectionVisibilityCardProps) {
  const sections = [
    {
      key: "hero" as const,
      label: "Hero Section",
      icon: Sparkles,
      enabled: settings.hero?.enabled ?? true,
    },
    {
      key: "stats" as const,
      label: "Platform Stats",
      icon: BarChart3,
      enabled: settings.stats?.enabled ?? true,
    },
    {
      key: "categories" as const,
      label: "Program Categories",
      icon: Grid,
      enabled: settings.categories?.enabled ?? true,
    },
    {
      key: "trendingWorkshops" as const,
      label: "Trending Courses",
      icon: Flame,
      enabled: settings.trendingWorkshops?.enabled ?? true,
    },
    {
      key: "graduates" as const,
      label: "Graduate Careers",
      icon: GraduationCap,
      enabled: settings.graduates?.enabled ?? true,
    },
    {
      key: "testimonialsSection" as const,
      label: "Testimonials",
      icon: MessageSquareQuote,
      enabled: settings.testimonialsSection?.enabled ?? true,
    },
    {
      key: "footer" as const,
      label: "Footer & Branding",
      icon: PanelBottom,
      enabled: settings.footer?.enabled ?? true,
    },
  ];

  const handleToggle = (key: keyof IHomepageSettings) => {
    const currentSection = settings[key] as any;
    if (!currentSection) return;

    onChange({
      ...settings,
      [key]: {
        ...currentSection,
        enabled: !currentSection.enabled,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Section Visibility Toggles */}
      <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Sliders className="size-4 text-violet-600" />
            Section Visibility
          </h3>
        </div>

        <div className="space-y-2.5">
          {sections.map(({ key, label, icon: Icon, enabled }) => {
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-2xl border p-3 transition-all ${
                  enabled
                    ? "border-violet-200 bg-violet-50/50 text-slate-900"
                    : "border-slate-200 bg-slate-50/60 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`grid size-7 place-items-center rounded-xl transition-colors ${
                      enabled
                        ? "bg-violet-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-semibold truncate">
                    {label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enabled ? "bg-violet-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Page Meta Card */}
      <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Page Meta
        </h4>

        <div className="mt-4 space-y-3.5 text-xs">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Last Published
            </p>
            <p className="mt-0.5 font-medium text-slate-700">
              Just now
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Status
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
