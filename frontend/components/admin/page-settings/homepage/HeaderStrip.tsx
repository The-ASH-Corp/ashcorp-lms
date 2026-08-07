"use client";

import React from "react";
import { Bell, CircleDot, Rocket, CheckCircle2 } from "lucide-react";

interface HeaderStripProps {
  onPublish: () => void;
  isPublishing?: boolean;
  savedSuccessfully?: boolean;
}

export function HeaderStrip({
  onPublish,
  isPublishing,
  savedSuccessfully,
}: HeaderStripProps) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_12px_32px_-22px_rgba(124,58,237,0.55)]">
     

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-700">
            <span className="inline-block size-1.5 rounded-full bg-violet-600 animate-ping" />
            Real-Time Draft Sync
          </div>
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
            Landing Page Settings
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Customize headlines, section visibility, featured content, testimonials, and footer details for your public landing page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-14px_rgba(124,58,237,0.9)] transition hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
          >
            {savedSuccessfully ? (
              <>
                <CheckCircle2 className="size-4 text-emerald-300" />
                Published!
              </>
            ) : isPublishing ? (
              "Saving..."
            ) : (
              <>
                <Rocket className="size-4" />
                Publish Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
