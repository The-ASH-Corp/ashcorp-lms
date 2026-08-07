"use client";

import React, { useEffect, useState } from "react";
import {
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  IHomepageSettings,
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { HeaderStrip } from "@/components/admin/page-settings/homepage/HeaderStrip";
import { SectionVisibilityCard } from "@/components/admin/page-settings/homepage/SectionVisibilityCard";
import { HeroOrchestrationCard } from "@/components/admin/page-settings/homepage/HeroOrchestrationCard";
import { StatsOrchestrationCard } from "@/components/admin/page-settings/homepage/StatsOrchestrationCard";
import { CategoriesOrchestrationCard } from "@/components/admin/page-settings/homepage/CategoriesOrchestrationCard";
import { TrendingWorkshopsCard } from "@/components/admin/page-settings/homepage/TrendingWorkshopsCard";
import { GraduateStoriesCard } from "@/components/admin/page-settings/homepage/GraduateStoriesCard";
import { TestimonialsOrchestrationCard } from "@/components/admin/page-settings/homepage/TestimonialsOrchestrationCard";
import { FooterOrchestrationCard } from "@/components/admin/page-settings/homepage/FooterOrchestrationCard";
import { toast } from "sonner";

export default function LandingPageSettings() {
  const { data: initialSettings, isLoading } = useGetHomepageSettingsQuery();
  const [updateHomepageSettings, { isLoading: isUpdating }] =
    useUpdateHomepageSettingsMutation();

  const [formState, setFormState] = useState<Partial<IHomepageSettings>>({});
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setFormState(initialSettings);
    }
  }, [initialSettings]);

  const handlePublish = async () => {
    try {
      await updateHomepageSettings(formState).unwrap();
      setSavedSuccessfully(true);
      toast.success("Homepage settings published successfully");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error("Failed to publish homepage settings", error);
      toast.error("Failed to publish homepage settings");
    }
  };

  if (isLoading || !formState.hero) {
    return (
      <main className="flex min-h-screen items-center justify-center rounded-3xl border border-violet-100 bg-white p-6 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-sm font-medium">Loading Landing Page Settings...</p>
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

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Column (Section Visibility & Overview) - 4 cols */}
          <div className="lg:col-span-4 space-y-5">
            <SectionVisibilityCard
              settings={formState}
              onChange={(updated) => setFormState(updated)}
            />
          </div>

          {/* Right Column (Content Orchestration Cards) - 8 cols */}
          <div className="lg:col-span-8 space-y-5">
            <HeroOrchestrationCard
              hero={formState.hero}
              onChange={(hero) => setFormState((prev) => ({ ...prev, hero }))}
            />

            <StatsOrchestrationCard
              stats={formState.stats!}
              onChange={(stats) => setFormState((prev) => ({ ...prev, stats }))}
            />

            <CategoriesOrchestrationCard
              categoriesSection={formState.categories!}
              onChange={(categories) =>
                setFormState((prev) => ({ ...prev, categories }))
              }
            />

            <TrendingWorkshopsCard
              trendingSection={formState.trendingWorkshops!}
              onChange={(trendingWorkshops) =>
                setFormState((prev) => ({ ...prev, trendingWorkshops }))
              }
            />

            <GraduateStoriesCard
              graduatesSection={formState.graduates!}
              onChange={(graduates) =>
                setFormState((prev) => ({ ...prev, graduates }))
              }
            />

            <TestimonialsOrchestrationCard
              testimonialsSection={formState.testimonialsSection!}
              onChange={(testimonialsSection) =>
                setFormState((prev) => ({ ...prev, testimonialsSection }))
              }
            />

            <FooterOrchestrationCard
              footer={formState.footer!}
              onChange={(footer) =>
                setFormState((prev) => ({ ...prev, footer }))
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