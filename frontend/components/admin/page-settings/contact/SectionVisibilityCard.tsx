"use client";

import React from "react";
import { Sliders, Sparkles, PhoneCall, Mail, MapPin, HelpCircle } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface SectionVisibilityCardProps {
  settings: IContactPageSettings;
  onChange: (updated: IContactPageSettings) => void;
}

export function SectionVisibilityCard({
  settings,
  onChange,
}: SectionVisibilityCardProps) {
  const visibility = settings.sectionVisibility || {
    hero: true,
    supportCards: true,
    inquiryForm: true,
    institutionMap: true,
    faqs: true,
  };

  const handleToggle = (key: keyof typeof visibility) => {
    const updatedVisibility = {
      ...visibility,
      [key]: !visibility[key],
    };

    onChange({
      ...settings,
      sectionVisibility: updatedVisibility,
    });
  };

  const sections = [
    { key: "hero" as const, label: "Hero Section", icon: Sparkles },
    { key: "supportCards" as const, label: "Student Support Cards", icon: PhoneCall },
    { key: "inquiryForm" as const, label: "Inquiry Form", icon: Mail },
    { key: "institutionMap" as const, label: "Institutional Partnerships", icon: MapPin },
    { key: "faqs" as const, label: "FAQs", icon: HelpCircle },
  ];

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
          {sections.map(({ key, label, icon: Icon }) => {
            const isEnabled = visibility[key];
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-2xl border p-3 transition-all ${
                  isEnabled
                    ? "border-violet-200 bg-violet-50/50 text-slate-900"
                    : "border-slate-200 bg-slate-50/60 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`grid size-7 place-items-center rounded-xl transition-colors ${
                      isEnabled ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-semibold truncate">{label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled ? "bg-violet-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? "translate-x-5" : "translate-x-0"
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
              {settings.updatedAt
                ? new Date(settings.updatedAt).toLocaleString()
                : "Just now"}
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
