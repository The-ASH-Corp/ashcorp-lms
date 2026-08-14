"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetAuthSettingsQuery, 
  useUpdateAuthSettingsMutation,
  IAuthSettings 
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { AuthSettingsCard } from "@/components/admin/page-settings/auth/AuthSettingsCard";

export default function AuthSettingsPage() {
  const { data: initialSettings, isLoading } = useGetAuthSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAuthSettingsMutation();

  const [settings, setSettings] = useState<IAuthSettings>({
    heroImage: "",
    heading: "",
    headingHighlight1: "",
    headingHighlight2: "",
    description: "",
    footerText: ""
  });

  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleUpdateField = (field: keyof IAuthSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings).unwrap();
      setSavedSuccessfully(true);
      toast.success("Auth settings updated successfully!");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      toast.error("Failed to update auth settings");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center rounded-3xl border border-violet-100 bg-white p-6 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-sm font-medium">Loading Auth Settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6 relative z-0 overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-6 relative z-10">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-violet-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Auth Page Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure the appearance and content of the login and registration pages.
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ${
                savedSuccessfully
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                  : "bg-violet-600 hover:bg-violet-700 shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isUpdating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? "Saving..." : savedSuccessfully ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <AuthSettingsCard
          settings={settings}
          onChange={handleUpdateField}
        />
      </div>
    </main>
  );
}
