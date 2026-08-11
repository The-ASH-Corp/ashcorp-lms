"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetContactSettingsQuery,
  useUpdateContactSettingsMutation,
  IContactPageSettings,
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { HeaderStrip } from "@/components/admin/page-settings/contact/HeaderStrip";
import { SectionVisibilityCard } from "@/components/admin/page-settings/contact/SectionVisibilityCard";
import { GlobalMetadataCard } from "@/components/admin/page-settings/contact/GlobalMetadataCard";
import { InquiryFormConfigCard } from "@/components/admin/page-settings/contact/InquiryFormConfigCard";
import { ContactDirectoriesCard } from "@/components/admin/page-settings/contact/ContactDirectoriesCard";
import { LocationMapCard } from "@/components/admin/page-settings/contact/LocationMapCard";
import { FaqConfigCard } from "@/components/admin/page-settings/contact/FaqConfigCard";

export default function ContactPageSettings() {
  const { data: initialSettings, isLoading } = useGetContactSettingsQuery();
  const [updateContactSettings, { isLoading: isUpdating }] =
    useUpdateContactSettingsMutation();

  const [formState, setFormState] = useState<Partial<IContactPageSettings>>({});
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("visibility");

  useEffect(() => {
    if (initialSettings) {
      setFormState(initialSettings);
    }
  }, [initialSettings]);

  const handlePublish = async () => {
    try {
      await updateContactSettings(formState).unwrap();
      setSavedSuccessfully(true);
      toast.success("Contact page settings published successfully");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      toast.error("Failed to publish contact page settings");
    }
  };

  const handleSectionToggle = (sectionKey: keyof NonNullable<IContactPageSettings["sectionVisibility"]>) => {
    setFormState((prev) => {
      const currentVis = prev.sectionVisibility || {
        hero: true,
        supportCards: true,
        inquiryForm: true,
        institutionMap: true,
        faqs: true,
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
          <p className="text-sm font-medium">Loading Contact Page Settings...</p>
        </div>
      </main>
    );
  }

  const visibility = formState.sectionVisibility || {
    hero: true,
    supportCards: true,
    inquiryForm: true,
    institutionMap: true,
    faqs: true,
  };

  const tabs = [
    { id: "visibility", label: "Visibility Settings" },
    { id: "metadata", label: "Global Metadata" },
    { id: "inquiry", label: "Inquiry Form" },
    { id: "directories", label: "Contact Directories" },
    { id: "location", label: "Location & Map" },
    { id: "faqs", label: "FAQs" },
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
                  settings={formState as IContactPageSettings}
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

            {activeTab === "inquiry" && formState.inquiryForm && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <InquiryFormConfigCard
                  inquiryForm={formState.inquiryForm}
                  isVisible={visibility.inquiryForm}
                  onToggleVisibility={() => handleSectionToggle("inquiryForm")}
                  onChange={(inquiryForm) =>
                    setFormState((prev) => ({ ...prev, inquiryForm }))
                  }
                />
              </div>
            )}

            {activeTab === "directories" && formState.directories && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ContactDirectoriesCard
                  directories={formState.directories}
                  isVisible={visibility.supportCards}
                  onToggleVisibility={() => handleSectionToggle("supportCards")}
                  onChange={(directories) =>
                    setFormState((prev) => ({ ...prev, directories }))
                  }
                />
              </div>
            )}

            {activeTab === "location" && formState.locationMap && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <LocationMapCard
                  locationMap={formState.locationMap}
                  isVisible={visibility.institutionMap}
                  onToggleVisibility={() => handleSectionToggle("institutionMap")}
                  onChange={(locationMap) =>
                    setFormState((prev) => ({ ...prev, locationMap }))
                  }
                />
              </div>
            )}

            {activeTab === "faqs" && formState.faqs && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <FaqConfigCard
                  faqs={formState.faqs}
                  isVisible={visibility.faqs}
                  onToggleVisibility={() => handleSectionToggle("faqs")}
                  onChange={(faqs) => setFormState((prev) => ({ ...prev, faqs }))}
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