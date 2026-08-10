"use client";

import React from "react";
import { FileText } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface GlobalMetadataCardProps {
  metadata: IContactPageSettings["metadata"];
  onChange: (updated: IContactPageSettings["metadata"]) => void;
}

export function GlobalMetadataCard({
  metadata,
  onChange,
}: GlobalMetadataCardProps) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
      <h4 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-900">
        <FileText className="size-4 text-violet-600" />
        Global Metadata
      </h4>

      <div className="mt-4 space-y-3.5">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Page Title
          </label>
          <input
            type="text"
            value={metadata?.pageTitle || ""}
            onChange={(e) =>
              onChange({ ...metadata, pageTitle: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
            placeholder="Contact Ash Academy"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={metadata?.metaDescription || ""}
            onChange={(e) =>
              onChange({ ...metadata, metaDescription: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y"
            placeholder="Get in touch with Ash Academy for admissions..."
          />
        </div>
      </div>
    </section>
  );
}
