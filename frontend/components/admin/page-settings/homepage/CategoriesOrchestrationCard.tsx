"use client";

import React from "react";
import Link from "next/link";
import { Blocks, ArrowUpRight, Power } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { useGetAllCategoriesQuery } from "@/lib/redux/features/category/categoryApi";

interface CategoriesOrchestrationCardProps {
  categoriesSection: IHomepageSettings["categories"];
  onChange: (updated: IHomepageSettings["categories"]) => void;
}

export function CategoriesOrchestrationCard({
  categoriesSection,
  onChange,
}: CategoriesOrchestrationCardProps) {
  const { data: categories = [] } = useGetAllCategoriesQuery();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Blocks className="size-4 text-violet-600" />
            Explore Categories Section
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Arrange and customize headlines for top category pathways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/category"
            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition hover:text-violet-700"
          >
            Manage Categories <ArrowUpRight className="size-3.5" />
          </Link>

          {/* On/Off Switch */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...categoriesSection,
                enabled: !categoriesSection.enabled,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              categoriesSection.enabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {categoriesSection.enabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <div className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-opacity ${!categoriesSection.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Section Subtitle
            </label>
            <input
              type="text"
              value={categoriesSection.subtitle || ""}
              onChange={(e) =>
                onChange({ ...categoriesSection, subtitle: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="CATEGORIES"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Main Section Title
            </label>
            <input
              type="text"
              value={categoriesSection.title || ""}
              onChange={(e) =>
                onChange({ ...categoriesSection, title: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="Explore Categories"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Section Subtext Description
          </label>
          <input
            type="text"
            value={categoriesSection.description || ""}
            onChange={(e) =>
              onChange({ ...categoriesSection, description: e.target.value })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500"
            placeholder="Hand-picked creative pathways just for you."
          />
        </div>

        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Live Registered Categories ({categories.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((cat) => (
              <span
                key={cat._id}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-2xs"
              >
                {cat.categoryName}
              </span>
            ))}
            {categories.length > 6 && (
              <span className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                +{categories.length - 6} more
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
