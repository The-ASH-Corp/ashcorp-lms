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
  const [activeTab, setActiveTab] = useState<string>("visibility");

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

  const tabs = [
    { id: "visibility", label: "Visibility Settings" },
    { id: "metadata", label: "Global Metadata" },
    { id: "hero", label: "Hero Config" },
    { id: "policy", label: "Policy Sections" },
    { id: "support", label: "Support CTA" },
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
                  settings={formState as IPrivacyPolicySettings}
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

            {activeTab === "policy" && formState.policySections && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <PolicySectionsCard
                  policySections={formState.policySections}
                  isVisible={visibility.policySections}
                  onToggleVisibility={() =>
                    handleSectionToggle("policySections")
                  }
                  onChange={(policySections) =>
                    setFormState((prev) => ({ ...prev, policySections }))
                  }
                />
              </div>
            )}

            {activeTab === "support" && formState.supportCta && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SupportCtaCard
                  supportCta={formState.supportCta}
                  isVisible={visibility.supportCta}
                  onToggleVisibility={() => handleSectionToggle("supportCta")}
                  onChange={(supportCta) =>
                    setFormState((prev) => ({ ...prev, supportCta }))
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