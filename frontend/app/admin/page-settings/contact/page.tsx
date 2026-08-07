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
      console.error("Failed to publish contact page settings", error);
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
          <div className="lg:col-span-4 space-y-5">
            <SectionVisibilityCard
              settings={formState as IContactPageSettings}
              onChange={(updated) => setFormState(updated)}
            />

            <GlobalMetadataCard
              metadata={formState.metadata!}
              onChange={(metadata) =>
                setFormState((prev) => ({ ...prev, metadata }))
              }
            />
          </div>

          {/* Right Column (Content Cards) - 8 cols */}
          <div className="lg:col-span-8 space-y-5">
            {/* Inquiry Form Config */}
            <InquiryFormConfigCard
              inquiryForm={formState.inquiryForm!}
              isVisible={visibility.inquiryForm}
              onToggleVisibility={() => handleSectionToggle("inquiryForm")}
              onChange={(inquiryForm) =>
                setFormState((prev) => ({ ...prev, inquiryForm }))
              }
            />

            {/* Contact Directories */}
            <ContactDirectoriesCard
              directories={formState.directories!}
              isVisible={visibility.supportCards}
              onToggleVisibility={() => handleSectionToggle("supportCards")}
              onChange={(directories) =>
                setFormState((prev) => ({ ...prev, directories }))
              }
            />

            {/* Location & Map Config */}
            <LocationMapCard
              locationMap={formState.locationMap!}
              isVisible={visibility.institutionMap}
              onToggleVisibility={() => handleSectionToggle("institutionMap")}
              onChange={(locationMap) =>
                setFormState((prev) => ({ ...prev, locationMap }))
              }
            />

            {/* Frequently Asked Questions */}
            <FaqConfigCard
              faqs={formState.faqs!}
              isVisible={visibility.faqs}
              onToggleVisibility={() => handleSectionToggle("faqs")}
              onChange={(faqs) => setFormState((prev) => ({ ...prev, faqs }))}
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