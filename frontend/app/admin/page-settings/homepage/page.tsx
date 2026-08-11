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
  const [activeTab, setActiveTab] = useState<string>("visibility");

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

  const tabs = [
    { id: "visibility", label: "Visibility Settings" },
    { id: "hero", label: "Hero Section" },
    { id: "stats", label: "Stats Section" },
    { id: "categories", label: "Categories" },
    { id: "trending", label: "Trending Workshops" },
    { id: "graduates", label: "Graduate Stories" },
    { id: "testimonials", label: "Testimonials" },
    { id: "footer", label: "Footer" },
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
                  settings={formState}
                  onChange={(updated) => setFormState(updated)}
                />
              </div>
            )}

            {activeTab === "hero" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <HeroOrchestrationCard
                  hero={formState.hero}
                  onChange={(hero) => setFormState((prev) => ({ ...prev, hero }))}
                />
              </div>
            )}

            {activeTab === "stats" && formState.stats && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <StatsOrchestrationCard
                  stats={formState.stats}
                  onChange={(stats) => setFormState((prev) => ({ ...prev, stats }))}
                />
              </div>
            )}

            {activeTab === "categories" && formState.categories && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CategoriesOrchestrationCard
                  categoriesSection={formState.categories}
                  onChange={(categories) =>
                    setFormState((prev) => ({ ...prev, categories }))
                  }
                />
              </div>
            )}

            {activeTab === "trending" && formState.trendingWorkshops && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <TrendingWorkshopsCard
                  trendingSection={formState.trendingWorkshops}
                  onChange={(trendingWorkshops) =>
                    setFormState((prev) => ({ ...prev, trendingWorkshops }))
                  }
                />
              </div>
            )}

            {activeTab === "graduates" && formState.graduates && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <GraduateStoriesCard
                  graduatesSection={formState.graduates}
                  onChange={(graduates) =>
                    setFormState((prev) => ({ ...prev, graduates }))
                  }
                />
              </div>
            )}

            {activeTab === "testimonials" && formState.testimonialsSection && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <TestimonialsOrchestrationCard
                  testimonialsSection={formState.testimonialsSection}
                  onChange={(testimonialsSection) =>
                    setFormState((prev) => ({ ...prev, testimonialsSection }))
                  }
                />
              </div>
            )}

            {activeTab === "footer" && formState.footer && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <FooterOrchestrationCard
                  footer={formState.footer}
                  onChange={(footer) =>
                    setFormState((prev) => ({ ...prev, footer }))
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