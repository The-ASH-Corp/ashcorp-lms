"use client";

import React from "react";
import { Rocket, CheckCircle2 } from "lucide-react";

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Terms & Conditions Settings
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Manage your terms & conditions page content, sections, and metadata.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {savedSuccessfully && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in">
            <CheckCircle2 className="size-4" />
            Published
          </span>
        )}

        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-300 disabled:opacity-60 cursor-pointer"
        >
          <Rocket className="size-3.5" />
          {isPublishing ? "Publishing..." : "Publish Changes"}
        </button>
      </div>
    </div>
  );
}
