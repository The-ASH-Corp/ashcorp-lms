"use client";

import React from "react";
import { MapPin, Power, Building2, ExternalLink } from "lucide-react";
import { IContactPageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface LocationMapCardProps {
  locationMap: IContactPageSettings["locationMap"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: IContactPageSettings["locationMap"]) => void;
}

function extractMapEmbedUrl(urlOrIframe: string): string {
  if (!urlOrIframe) return "";
  const match = urlOrIframe.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }
  return urlOrIframe.trim();
}

export function LocationMapCard({
  locationMap,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: LocationMapCardProps) {
  const currentMap = {
    enabled: locationMap?.enabled ?? true,
    sectionTitle: locationMap?.sectionTitle || "Our Campus & Location",
    title:
      locationMap?.title && locationMap?.title !== "Our Campus & Location"
        ? locationMap.title
        : "Tirur Campus",
    address:
      locationMap?.address ||
      "Ashcorp Technology - Digital Marketing, Software Development, Tirur",
    mapEmbedUrl:
      locationMap?.mapEmbedUrl ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d712.5535472308395!2d75.94660271623343!3d10.953023494019337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b35545b7a371%3A0x59efa33ed27234a7!2sAshcorp%20Technology-%20Digital%20Marketing%2C%20Software%20Development%2C%20Flutter%20%2C%20MERN%20Stack%20Development%20in%20Tirur!5e1!3m2!1sen!2sin!4v1785563688272!5m2!1sen!2sin",
    secondaryTitle:
      locationMap?.secondaryTitle || "Calicut Campus (HiLITE Business Park)",
    secondaryAddress:
      locationMap?.secondaryAddress ||
      "HiLITE Business Park, Kozhikode, Kerala",
    secondaryMapEmbedUrl:
      locationMap?.secondaryMapEmbedUrl ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1455.378419197244!2d75.83347121985852!3d11.24809597559352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6597c304c1f3b%3A0xbb7abc23c1ea8a!2sHiLITE%20Business%20Park!5e1!3m2!1sen!2sin!4v1794982341203!5m2!1sen!2sin",
  };

  const handlePrimaryUrlChange = (value: string) => {
    const extracted = extractMapEmbedUrl(value);
    onChange({ ...currentMap, mapEmbedUrl: extracted });
  };

  const handleSecondaryUrlChange = (value: string) => {
    const extracted = extractMapEmbedUrl(value);
    onChange({ ...currentMap, secondaryMapEmbedUrl: extracted });
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <MapPin className="size-4 text-violet-600" />
          Location & Dual Maps Config
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
        className={`space-y-6 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Main Section Heading */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Section Heading Title
          </label>
          <input
            type="text"
            value={currentMap.sectionTitle}
            onChange={(e) =>
              onChange({ ...currentMap, sectionTitle: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
            placeholder="e.g. Our Campus & Location"
          />
        </div>

        {/* Locations Side-by-Side Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Location 1 Box */}
          <div className="flex flex-col justify-between rounded-2xl border border-violet-100 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
              <Building2 className="size-4 text-violet-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Campus 1 (Primary Location)
              </h3>
              <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-700">
                Map 1
              </span>
            </div>

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
                  placeholder="e.g. Tirur Campus"
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Google Maps Embed URL or &lt;iframe&gt; Code
                </label>
                <span className="text-[10px] text-slate-400">
                  Auto-extracts URL
                </span>
              </div>
              <textarea
                rows={2}
                value={currentMap.mapEmbedUrl}
                onChange={(e) => handlePrimaryUrlChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y font-mono"
                placeholder="Paste Google Maps iframe src or embed URL here..."
              />
            </div>

            {currentMap.mapEmbedUrl && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs mt-auto">
                <div className="flex items-center justify-between p-2 bg-slate-100 border-b border-slate-200">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Live Preview: Campus 1
                  </p>
                  <a
                    href={currentMap.mapEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-600 hover:underline"
                  >
                    <span>Open preview</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="h-44 w-full bg-slate-100">
                  <iframe
                    title="Campus 1 Preview"
                    src={currentMap.mapEmbedUrl}
                    className="size-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location 2 Box */}
          <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
              <Building2 className="size-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Campus 2 (Secondary Location)
              </h3>
              <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                Map 2
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Location Title
                </label>
                <input
                  type="text"
                  value={currentMap.secondaryTitle}
                  onChange={(e) =>
                    onChange({ ...currentMap, secondaryTitle: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
                  placeholder="e.g. Calicut Campus (HiLITE Business Park)"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Address / Details
                </label>
                <input
                  type="text"
                  value={currentMap.secondaryAddress}
                  onChange={(e) =>
                    onChange({ ...currentMap, secondaryAddress: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
                  placeholder="e.g. HiLITE Business Park, Kozhikode, Kerala"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Google Maps Embed URL or &lt;iframe&gt; Code
                </label>
                <span className="text-[10px] text-slate-400">
                  Auto-extracts URL
                </span>
              </div>
              <textarea
                rows={2}
                value={currentMap.secondaryMapEmbedUrl}
                onChange={(e) => handleSecondaryUrlChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all resize-y font-mono"
                placeholder="Paste Google Maps iframe src or embed URL here..."
              />
            </div>

            {currentMap.secondaryMapEmbedUrl && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs mt-auto">
                <div className="flex items-center justify-between p-2 bg-slate-100 border-b border-slate-200">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Live Preview: Campus 2
                  </p>
                  <a
                    href={currentMap.secondaryMapEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:underline"
                  >
                    <span>Open preview</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="h-44 w-full bg-slate-100">
                  <iframe
                    title="Campus 2 Preview"
                    src={currentMap.secondaryMapEmbedUrl}
                    className="size-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
