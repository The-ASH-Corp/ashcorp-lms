"use client";

import React from "react";
import { PhoneCall, Building2, Phone, Power } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface ContactDirectoriesCardProps {
  directories: IContactPageSettings["directories"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: IContactPageSettings["directories"]) => void;
}

export function ContactDirectoriesCard({
  directories,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: ContactDirectoriesCardProps) {
  const studentSupport = directories?.studentSupport || {
    phone: "+91 9037009400",
    email: "connect@ashacademy.ai",
    description: "Dedicated assistance for enrollment, course access, and technical inquiries.",
  };

  const partnerships = directories?.partnerships || {
    email: "hr@ashacademy.ai",
    description: "Explore institutional collaboration and corporate training opportunities.",
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <PhoneCall className="size-4 text-violet-600" />
          Contact Directories (Support Cards)
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
        className={`grid grid-cols-1 gap-5 md:grid-cols-2 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Student Support Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Phone className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Student Support Directory
            </h3>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Support Phone
            </label>
            <input
              type="text"
              value={studentSupport.phone}
              onChange={(e) =>
                onChange({
                  ...directories,
                  studentSupport: { ...studentSupport, phone: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="+91 9037009400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Support Email
            </label>
            <input
              type="email"
              value={studentSupport.email}
              onChange={(e) =>
                onChange({
                  ...directories,
                  studentSupport: { ...studentSupport, email: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="connect@ashacademy.ai"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Card Description
            </label>
            <textarea
              rows={2}
              value={studentSupport.description}
              onChange={(e) =>
                onChange({
                  ...directories,
                  studentSupport: { ...studentSupport, description: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
              placeholder="Dedicated assistance..."
            />
          </div>
        </div>

        {/* Partnerships Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Building2 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Partnerships Directory
            </h3>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Partnership Email
            </label>
            <input
              type="email"
              value={partnerships.email}
              onChange={(e) =>
                onChange({
                  ...directories,
                  partnerships: { ...partnerships, email: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="hr@ashacademy.ai"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Card Description
            </label>
            <textarea
              rows={4}
              value={partnerships.description}
              onChange={(e) =>
                onChange({
                  ...directories,
                  partnerships: { ...partnerships, description: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
              placeholder="Explore institutional collaboration..."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
