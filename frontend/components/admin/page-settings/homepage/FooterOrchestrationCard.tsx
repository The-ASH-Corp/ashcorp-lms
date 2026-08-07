"use client";

import React from "react";
import { Layout, Mail, Power } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface FooterOrchestrationCardProps {
  footer: IHomepageSettings["footer"];
  onChange: (updatedFooter: IHomepageSettings["footer"]) => void;
}

export function FooterOrchestrationCard({
  footer,
  onChange,
}: FooterOrchestrationCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Layout className="size-4 text-violet-600" />
          Footer Settings
        </h2>

        {/* On/Off Switch */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...footer,
              enabled: !footer.enabled,
            })
          }
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
            footer.enabled
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Power className="size-3.5" />
          {footer.enabled ? "Active" : "Hidden"}
        </button>
      </div>

      <div className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-opacity ${!footer.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Brand Tagline / Description
          </label>
          <textarea
            rows={2}
            value={footer.brandDescription || ""}
            onChange={(e) =>
              onChange({ ...footer, brandDescription: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500"
            placeholder="Making creative education accessible, fun, and results-driven for learners everywhere."
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Copyright Notice
            </label>
            <input
              type="text"
              value={footer.copyrightText || ""}
              onChange={(e) =>
                onChange({ ...footer, copyrightText: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="© 2026 Ash Academy. Empowering learners worldwide."
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Contact Email
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Mail className="size-4 text-slate-400" />
              <input
                type="email"
                value={footer.contactEmail || ""}
                onChange={(e) =>
                  onChange({ ...footer, contactEmail: e.target.value })
                }
                className="w-full text-sm text-slate-900 outline-none"
                placeholder="support@ashacademy.com"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
