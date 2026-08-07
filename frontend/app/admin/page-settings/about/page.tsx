"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetAboutSettingsQuery,
  useUpdateAboutSettingsMutation,
  IAboutPageSettings,
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { HeaderStrip } from "@/components/admin/page-settings/about/HeaderStrip";
import { SectionVisibilityCard } from "@/components/admin/page-settings/about/SectionVisibilityCard";
import { PrimaryNarrativeCard } from "@/components/admin/page-settings/about/PrimaryNarrativeCard";
import { LeadershipCard } from "@/components/admin/page-settings/about/LeadershipCard";
import { ImpactMetricsCard } from "@/components/admin/page-settings/about/ImpactMetricsCard";
import { CoreValuesCard } from "@/components/admin/page-settings/about/CoreValuesCard";
import { EducationalPhilosophyCard } from "@/components/admin/page-settings/about/EducationalPhilosophyCard";

export default function AboutPageSettings() {
  const { data: initialSettings, isLoading } = useGetAboutSettingsQuery();
  const [updateAboutSettings, { isLoading: isUpdating }] =
    useUpdateAboutSettingsMutation();

  const [formState, setFormState] = useState<Partial<IAboutPageSettings>>({});
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setFormState(initialSettings);
    }
  }, [initialSettings]);

  const handlePublish = async () => {
    try {
      await updateAboutSettings(formState).unwrap();
      setSavedSuccessfully(true);
      toast.success("About page settings published successfully to database");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error("Failed to publish About page settings:", error);
      toast.error("Failed to publish settings to database");
    }
  };

  if (isLoading || !formState.hero) {
    return (
      <main className="flex min-h-screen items-center justify-center rounded-3xl border border-violet-100 bg-white p-6 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-sm font-medium">Loading About Page Settings from Database...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header Strip & Action Triggers */}
        <HeaderStrip
          onPublish={handlePublish}
          isPublishing={isUpdating}
          savedSuccessfully={savedSuccessfully}
        />

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Column (Visibility Toggles & Meta) - 4 cols */}
          <div className="lg:col-span-4">
            <SectionVisibilityCard
              settings={formState as IAboutPageSettings}
              onChange={(updated) => setFormState(updated)}
            />
          </div>

          {/* Right Column (Content Cards) - 8 cols */}
          <div className="lg:col-span-8 space-y-5">
            {/* Primary Narrative (Hero) */}
            <PrimaryNarrativeCard
              hero={formState.hero!}
              onChange={(hero) => setFormState((prev) => ({ ...prev, hero }))}
            />

            {/* Meet Our Visionaries (Leadership Grid) */}
            <LeadershipCard
              leadership={formState.leadership!}
              onChange={(leadership) =>
                setFormState((prev) => ({ ...prev, leadership }))
              }
            />

            {/* Impact Metrics (Auto DB numbers + On/Off switch only) */}
            <ImpactMetricsCard
              impactMetrics={formState.impactMetrics!}
              onChange={(impactMetrics) =>
                setFormState((prev) => ({ ...prev, impactMetrics }))
              }
            />

            {/* Core Values */}
            <CoreValuesCard
              coreValues={formState.coreValues!}
              onChange={(coreValues) =>
                setFormState((prev) => ({ ...prev, coreValues }))
              }
            />

            {/* Educational Philosophy */}
            <EducationalPhilosophyCard
              philosophy={formState.philosophy!}
              onChange={(philosophy) =>
                setFormState((prev) => ({ ...prev, philosophy }))
              }
            />
          </div>
        </div>
      </div>

      {/* Background aesthetics */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_5%,rgba(124,58,237,0.09),transparent_28%),radial-gradient(circle_at_90%_90%,rgba(124,58,237,0.07),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-violet-100 to-transparent" />
    </main>
  );
}