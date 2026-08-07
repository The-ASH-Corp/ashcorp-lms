"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetPrivacyPolicySettingsQuery,
  useUpdatePrivacyPolicySettingsMutation,
  IPrivacyPolicySettings,
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { HeaderStrip } from "@/components/admin/page-settings/privacy-policy/HeaderStrip";
import { SectionVisibilityCard } from "@/components/admin/page-settings/privacy-policy/SectionVisibilityCard";
import { GlobalMetadataCard } from "@/components/admin/page-settings/privacy-policy/GlobalMetadataCard";
import { HeroConfigCard } from "@/components/admin/page-settings/privacy-policy/HeroConfigCard";
import { PolicySectionsCard } from "@/components/admin/page-settings/privacy-policy/PolicySectionsCard";
import { SupportCtaCard } from "@/components/admin/page-settings/privacy-policy/SupportCtaCard";

export default function PrivacyPolicySettings() {
  const { data: initialSettings, isLoading } =
    useGetPrivacyPolicySettingsQuery();
  const [updatePrivacyPolicySettings, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicySettingsMutation();

  const [formState, setFormState] = useState<Partial<IPrivacyPolicySettings>>(
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
      await updatePrivacyPolicySettings(formState).unwrap();
      setSavedSuccessfully(true);
      toast.success("Privacy policy settings published successfully");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error("Failed to publish privacy policy settings", error);
      toast.error("Failed to publish privacy policy settings");
    }
  };

  const handleSectionToggle = (
    sectionKey: keyof NonNullable<IPrivacyPolicySettings["sectionVisibility"]>
  ) => {
    setFormState((prev) => {
      const currentVis = prev.sectionVisibility || {
        hero: true,
        policySections: true,
        supportCta: true,
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
            Loading Privacy Policy Settings...
          </p>
        </div>
      </main>
    );
  }

  const visibility = formState.sectionVisibility || {
    hero: true,
    policySections: true,
    supportCta: true,
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
              settings={formState as IPrivacyPolicySettings}
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

            {/* Policy Sections */}
            <PolicySectionsCard
              policySections={formState.policySections!}
              isVisible={visibility.policySections}
              onToggleVisibility={() =>
                handleSectionToggle("policySections")
              }
              onChange={(policySections) =>
                setFormState((prev) => ({ ...prev, policySections }))
              }
            />

            {/* Support CTA */}
            <SupportCtaCard
              supportCta={formState.supportCta!}
              isVisible={visibility.supportCta}
              onToggleVisibility={() => handleSectionToggle("supportCta")}
              onChange={(supportCta) =>
                setFormState((prev) => ({ ...prev, supportCta }))
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