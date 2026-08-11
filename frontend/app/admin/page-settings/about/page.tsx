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
  const [activeTab, setActiveTab] = useState<string>("visibility");

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

  const tabs = [
    { id: "visibility", label: "Visibility Settings" },
    { id: "narrative", label: "Primary Narrative" },
    { id: "visionaries", label: "Meet Our Visionaries" },
    { id: "metrics", label: "Impact Metrics" },
    { id: "coreValues", label: "Core Values" },
    { id: "philosophy", label: "Educational Philosophy" },
  ];

  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6 relative z-0 overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-6 relative z-10">
        {/* Header Strip & Action Triggers */}
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
                  settings={formState as IAboutPageSettings}
                  onChange={(updated) => setFormState(updated)}
                />
              </div>
            )}

            {activeTab === "narrative" && formState.hero && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <PrimaryNarrativeCard
                  hero={formState.hero}
                  onChange={(hero) => setFormState((prev) => ({ ...prev, hero }))}
                />
              </div>
            )}

            {activeTab === "visionaries" && formState.leadership && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <LeadershipCard
                  leadership={formState.leadership}
                  onChange={(leadership) =>
                    setFormState((prev) => ({ ...prev, leadership }))
                  }
                />
              </div>
            )}

            {activeTab === "metrics" && formState.impactMetrics && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ImpactMetricsCard
                  impactMetrics={formState.impactMetrics}
                  onChange={(impactMetrics) =>
                    setFormState((prev) => ({ ...prev, impactMetrics }))
                  }
                />
              </div>
            )}

            {activeTab === "coreValues" && formState.coreValues && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CoreValuesCard
                  coreValues={formState.coreValues}
                  onChange={(coreValues) =>
                    setFormState((prev) => ({ ...prev, coreValues }))
                  }
                />
              </div>
            )}

            {activeTab === "philosophy" && formState.philosophy && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <EducationalPhilosophyCard
                  philosophy={formState.philosophy}
                  onChange={(philosophy) =>
                    setFormState((prev) => ({ ...prev, philosophy }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background aesthetics */}
     
    </main>
  );
}