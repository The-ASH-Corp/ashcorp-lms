"use client";

import React from "react";
import { Mail, CheckCircle2, Power } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface InquiryFormConfigCardProps {
  inquiryForm: IContactPageSettings["inquiryForm"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: IContactPageSettings["inquiryForm"]) => void;
}

export function InquiryFormConfigCard({
  inquiryForm,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: InquiryFormConfigCardProps) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Mail className="size-4 text-violet-600" />
          Inquiry Form Config
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
        className={`grid grid-cols-1 gap-5 lg:grid-cols-12 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Form Settings Inputs - 7 cols */}
        <div className="lg:col-span-7 space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Form Heading
            </label>
            <input
              type="text"
              value={inquiryForm?.formHeading || ""}
              onChange={(e) =>
                onChange({ ...inquiryForm, formHeading: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="Send an Inquiry"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Routing Email Address
            </label>
            <input
              type="email"
              value={inquiryForm?.routingEmail || ""}
              onChange={(e) =>
                onChange({ ...inquiryForm, routingEmail: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="inquiries@ashacademy.ai"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Success Message
            </label>
            <textarea
              rows={3}
              value={inquiryForm?.successMessage || ""}
              onChange={(e) =>
                onChange({ ...inquiryForm, successMessage: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
              placeholder="Thank you for contacting Ash Academy..."
            />
          </div>
        </div>

        {/* Form Fields Preview Box - 5 cols */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-violet-100 bg-white p-4 shadow-2xs">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Form Fields Preview
              </h4>
              <span className="rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                Live Form Layout
              </span>
            </div>

            <div className="space-y-2 text-xs opacity-75">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 font-medium">
                Full Name *
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 font-medium">
                Phone Number *
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 font-medium">
                Work Email *
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 font-medium flex items-center justify-between">
                <span>Inquiry Type (Dropdown)</span>
                <span className="text-[10px]">▼</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 font-medium h-14">
                Message *
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <CheckCircle2 className="size-3.5" />
            Standard responsive validation enabled
          </div>
        </div>
      </div>
    </section>
  );
}
