"use client";

import React from "react";
import { ComponentType } from "react";
import { LayoutTemplate, Blocks, GraduationCap, MessageSquareText } from "lucide-react";
import { IHomepageSettings } from "@/lib/redux/features/page-settings/pageSettingsApi";

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>;
  badge: string;
  badgeTone: "violet" | "slate" | "red" | "emerald";
  title: string;
  value: string;
};

function MetricCard({
  icon: Icon,
  badge,
  badgeTone,
  title,
  value,
}: MetricCardProps) {
  const badgeToneClass =
    badgeTone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : badgeTone === "violet"
        ? "border-violet-200 bg-violet-50 text-violet-700"
        : badgeTone === "red"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-white text-slate-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.15)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="grid size-8 place-items-center rounded-lg border border-violet-100 bg-violet-50 text-violet-600">
          <Icon className="size-4" />
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeToneClass}`}
        >
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

interface MetricsOverviewProps {
  settings?: Partial<IHomepageSettings>;
}

export function MetricsOverview({ settings }: MetricsOverviewProps) {
  const heroStatus = settings?.hero?.enabled !== false ? "Active" : "Hidden";
  const categoriesStatus = settings?.categories?.enabled !== false ? "Active" : "Hidden";
  const trendingStatus = settings?.trendingWorkshops?.enabled !== false ? "Active" : "Hidden";
  const testimonialsCount = settings?.testimonialsSection?.items?.filter((i) => i.isApproved !== false).length || 0;
  const testimonialsStatus = settings?.testimonialsSection?.enabled !== false ? `${testimonialsCount} Active` : "Hidden";

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={LayoutTemplate}
        badge={heroStatus}
        badgeTone={heroStatus === "Active" ? "emerald" : "slate"}
        title="Hero Banner Section"
        value={heroStatus === "Active" ? "Visible on Landing Page" : "Hidden from Landing Page"}
      />
      <MetricCard
        icon={Blocks}
        badge={categoriesStatus}
        badgeTone={categoriesStatus === "Active" ? "emerald" : "slate"}
        title="Explore Categories"
        value={categoriesStatus === "Active" ? "Dynamic Carousel Active" : "Section Hidden"}
      />
      <MetricCard
        icon={GraduationCap}
        badge={trendingStatus}
        badgeTone={trendingStatus === "Active" ? "emerald" : "slate"}
        title="Trending Courses"
        value={trendingStatus === "Active" ? "Auto-ranked by Enrollment" : "Section Hidden"}
      />
      <MetricCard
        icon={MessageSquareText}
        badge={testimonialsStatus}
        badgeTone={settings?.testimonialsSection?.enabled !== false ? "violet" : "slate"}
        title="Student Testimonials"
        value={testimonialsStatus}
      />
    </div>
  );
}
