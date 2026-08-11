"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useUploadImageMutation,
  IGeneralSettings,
} from "@/lib/redux/features/page-settings/pageSettingsApi";
import { Save, UploadCloud, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function GeneralSettings() {
  const { data: initialSettings, isLoading } = useGetGeneralSettingsQuery();
  const [updateGeneralSettings, { isLoading: isUpdating }] =
    useUpdateGeneralSettingsMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [formState, setFormState] = useState<Partial<IGeneralSettings>>({});
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialSettings) {
      setFormState(initialSettings);
    }
  }, [initialSettings]);

  const handlePublish = async () => {
    try {
      await updateGeneralSettings(formState).unwrap();
      setSavedSuccessfully(true);
      toast.success("General settings published successfully to database");
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      toast.error("Failed to publish settings to database");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await uploadImage(formData).unwrap();
      if (response.success && response.url) {
        setFormState((prev) => ({ ...prev, logoUrl: response.url }));
        toast.success("Logo uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload logo");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center rounded-3xl border border-violet-100 bg-white p-6 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-sm font-medium">Loading General Settings from Database...</p>
        </div>
      </main>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || '';

  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6 relative z-0 overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-6 relative z-10">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-violet-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">General Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your global company settings like the logo.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handlePublish}
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
              {isUpdating ? "Publishing..." : savedSuccessfully ? "Published!" : "Publish Changes"}
            </button>
          </div>
        </div>

        {/* Logo Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Company Logo</h2>
                <p className="text-sm text-slate-500">
                  Upload a company logo that will reflect globally across the application.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Logo Preview */}
                <div className="flex-shrink-0">
                  <div className="text-sm font-medium text-slate-700 mb-3">Current Logo</div>
                  <div className="w-48 h-48 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                    {formState.logoUrl ? (
                      <Image 
                        src={`${apiBase}${formState.logoUrl}`} 
                        alt="Logo" 
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs font-medium uppercase tracking-wider">No Logo Set</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Action */}
                <div className="flex-1 max-w-lg">
                  <div className="text-sm font-medium text-slate-700 mb-3">Upload New Logo</div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border border-slate-200 bg-white p-6 text-center transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:shadow-md hover:shadow-violet-100/50 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
                      {isUploading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-600/40 border-t-violet-600" />
                      ) : (
                        <UploadCloud className="h-6 w-6" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Click to upload an image</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
