"use client";

import React from "react";
import { GraduationCap, Power, Upload, ImageIcon } from "lucide-react";
import { IAboutPageSettings } from "./aboutSettingsTypes";

interface EducationalPhilosophyCardProps {
  philosophy: IAboutPageSettings["philosophy"];
  onChange: (updated: IAboutPageSettings["philosophy"]) => void;
}

export function EducationalPhilosophyCard({
  philosophy,
  onChange,
}: EducationalPhilosophyCardProps) {
  const isEnabled = philosophy?.enabled ?? true;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({ ...philosophy, image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <GraduationCap className="size-4 text-violet-600" />
          Educational Philosophy
        </h2>

        <button
          type="button"
          onClick={() => onChange({ ...philosophy, enabled: !isEnabled })}
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

      <div
        className={`rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Image Upload / Preview Column (Local Storage) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl border border-violet-200 shadow-xs bg-slate-100 group">
              {philosophy?.image ? (
                /* eslint-disable-next-html-element-for-img */
                <img
                  src={philosophy.image}
                  alt="Educational Philosophy"
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center bg-violet-50 text-violet-500">
                  <ImageIcon className="size-8" />
                </div>
              )}

              {/* Upload overlay */}
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold gap-1.5 p-3 text-center">
                <Upload className="size-5" />
                Change Image (Local Upload)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 font-medium text-center">
              Image is stored locally (no S3 upload required)
            </p>
          </div>

          {/* Text Inputs Column */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Section Heading
              </label>
              <input
                type="text"
                value={philosophy?.sectionHeading || ""}
                onChange={(e) =>
                  onChange({ ...philosophy, sectionHeading: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
                placeholder="Built for Lifelong Learners"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Philosophy Content
              </label>
              <textarea
                rows={5}
                value={philosophy?.philosophyContent || ""}
                onChange={(e) =>
                  onChange({ ...philosophy, philosophyContent: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
                placeholder="Describe your educational philosophy..."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
