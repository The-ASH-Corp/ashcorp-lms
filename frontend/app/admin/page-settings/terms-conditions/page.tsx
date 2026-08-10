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
  const [activeTab, setActiveTab] = useState<string>("visibility");

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

  const tabs = [
    { id: "visibility", label: "Visibility Settings" },
    { id: "metadata", label: "Global Metadata" },
    { id: "hero", label: "Hero Config" },
    { id: "sections", label: "Terms Sections" },
  ];

  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6 relative z-0 overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-6 relative z-10">
        {/* Header Strip */}
        <HeaderStrip
          onPublish={handlePublish}
          isPublishing={isUpdating}
          savedSuccessfully={savedSuccessfully}
        />

        {/* Tabbed Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="sticky top-6 flex flex-col gap-1.5 rounded-2xl bg-slate-50/50 p-2 border border-slate-100 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-violet-700 shadow-sm border border-violet-100"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 transition-all duration-300">
            {activeTab === "visibility" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionVisibilityCard
                  settings={formState as ITermsConditionsSettings}
                  onChange={(updated) => setFormState(updated)}
                />
              </div>
            )}

            {activeTab === "metadata" && formState.metadata && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <GlobalMetadataCard
                  metadata={formState.metadata}
                  onChange={(metadata) =>
                    setFormState((prev) => ({ ...prev, metadata }))
                  }
                />
              </div>
            )}

            {activeTab === "hero" && formState.hero && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <HeroConfigCard
                  hero={formState.hero}
                  isVisible={visibility.hero}
                  onToggleVisibility={() => handleSectionToggle("hero")}
                  onChange={(hero) =>
                    setFormState((prev) => ({ ...prev, hero }))
                  }
                />
              </div>
            )}

            {activeTab === "sections" && formState.termsSections && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <TermsSectionsCard
                  termsSections={formState.termsSections}
                  isVisible={visibility.termsSections}
                  onToggleVisibility={() => handleSectionToggle("termsSections")}
                  onChange={(termsSections) =>
                    setFormState((prev) => ({ ...prev, termsSections }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}