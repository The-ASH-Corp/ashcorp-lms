"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetTermsConditionsSettingsQuery,
  useUpdateTermsConditionsSettingsMutation,
  ITermsConditionsSettings,
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { HeaderStrip } from "@/components/admin/page-settings/terms-conditions/HeaderStrip";
import { SectionVisibilityCard } from "@/components/admin/page-settings/terms-conditions/SectionVisibilityCard";
import { GlobalMetadataCard } from "@/components/admin/page-settings/terms-conditions/GlobalMetadataCard";
import { HeroConfigCard } from "@/components/admin/page-settings/terms-conditions/HeroConfigCard";
import { TermsSectionsCard } from "@/components/admin/page-settings/terms-conditions/TermsSectionsCard";

export default function TermsAndConditionsPage() {
  const { data: initialSettings, isLoading } =
    useGetTermsConditionsSettingsQuery();
  const [updateTermsConditionsSettings, { isLoading: isUpdating }] =
    useUpdateTermsConditionsSettingsMutation();

  const [formState, setFormState] = useState<Partial<ITermsConditionsSettings>>(
    {}
  );
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setFormState(initialSettings);
    }
  }, [initialSettings]);

  const handlePublish = async () => {
    try {
      await updateTermsConditionsSettings(formState).unwrap();
      setSavedSuccessfully(true);
      toast.success("Terms & conditions settings published successfully");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error("Failed to publish terms & conditions settings", error);
      toast.error("Failed to publish terms & conditions settings");
    }
  };

  const handleSectionToggle = (
    sectionKey: keyof NonNullable<ITermsConditionsSettings["sectionVisibility"]>
  ) => {
    setFormState((prev) => {
      const currentVis = prev.sectionVisibility || {
        hero: true,
        termsSections: true,
      };
      return {
        ...prev,
        sectionVisibility: {
          ...currentVis,
          [sectionKey]: !currentVis[sectionKey],
        },
      };
    });
  };

  if (isLoading || !formState.hero) {
    return (
      <main className="flex min-h-screen items-center justify-center rounded-3xl border border-violet-100 bg-white p-6 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-sm font-medium">
            Loading Terms & Conditions Settings...
          </p>
        </div>
      </main>
    );
  }

  const visibility = formState.sectionVisibility || {
    hero: true,
    termsSections: true,
  };

  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header Strip */}
        <HeaderStrip
          onPublish={handlePublish}
          isPublishing={isUpdating}
          savedSuccessfully={savedSuccessfully}
        />

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Column - 4 cols */}
          <div className="lg:col-span-4 space-y-5">
            <SectionVisibilityCard
              settings={formState as ITermsConditionsSettings}
              onChange={(updated) => setFormState(updated)}
            />

            <GlobalMetadataCard
              metadata={formState.metadata!}
              onChange={(metadata) =>
                setFormState((prev) => ({ ...prev, metadata }))
              }
            />
          </div>

          {/* Right Column - 8 cols */}
          <div className="lg:col-span-8 space-y-5">
            {/* Hero Config */}
            <HeroConfigCard
              hero={formState.hero!}
              isVisible={visibility.hero}
              onToggleVisibility={() => handleSectionToggle("hero")}
              onChange={(hero) =>
                setFormState((prev) => ({ ...prev, hero }))
              }
            />

            {/* Terms Sections */}
            <TermsSectionsCard
              termsSections={formState.termsSections!}
              isVisible={visibility.termsSections}
              onToggleVisibility={() => handleSectionToggle("termsSections")}
              onChange={(termsSections) =>
                setFormState((prev) => ({ ...prev, termsSections }))
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