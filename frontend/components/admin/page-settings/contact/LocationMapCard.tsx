"use client";

import React from "react";
import { MapPin, Power } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface LocationMapCardProps {
  locationMap: IContactPageSettings["locationMap"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: IContactPageSettings["locationMap"]) => void;
}

export function LocationMapCard({
  locationMap,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: LocationMapCardProps) {
  const currentMap = locationMap || {
    enabled: true,
    title: "Our Campus & Location",
    address: "Ashcorp Technology - Digital Marketing, Software Development, Tirur",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d712.5535472308395!2d75.94660271623343!3d10.953023494019337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b35545b7a371%3A0x59efa33ed27234a7!2sAshcorp%20Technology-%20Digital%20Marketing%2C%20Software%20Development%2C%20Flutter%20%2C%20MERN%20Stack%20Development%20in%20Tirur!5e1!3m2!1sen!2sin!4v1785563688272!5m2!1sen!2sin",
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <MapPin className="size-4 text-violet-600" />
          Location & Map Config
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
        className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Location Title
            </label>
            <input
              type="text"
              value={currentMap.title}
              onChange={(e) =>
                onChange({ ...currentMap, title: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="e.g. Our Campus & Location"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Address / Details
            </label>
            <input
              type="text"
              value={currentMap.address}
              onChange={(e) =>
                onChange({ ...currentMap, address: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="e.g. Ashcorp Technology, Tirur"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Google Maps Embed URL (iframe src)
          </label>
          <textarea
            rows={2}
            value={currentMap.mapEmbedUrl}
            onChange={(e) =>
              onChange({ ...currentMap, mapEmbedUrl: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y font-mono"
            placeholder="Paste Google Maps iframe src URL here..."
          />
        </div>

        {/* Live Map Preview Box */}
        {currentMap.mapEmbedUrl && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
            <p className="p-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border-b border-slate-200">
              Live Map Preview
            </p>
            <div className="h-48 w-full bg-slate-100">
              <iframe
                title="Location Map Preview"
                src={currentMap.mapEmbedUrl}
                className="size-full border-0"
                allowFullScreen={true}
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
