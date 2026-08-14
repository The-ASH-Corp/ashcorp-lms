"use client";

import React, { useRef, useState } from "react";
import { LayoutTemplate, Power, PowerOff, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { IAuthSettings, useUploadImageMutation } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface AuthSettingsCardProps {
  settings: IAuthSettings;
  onChange: (field: keyof IAuthSettings, value: any) => void;
}

export function AuthSettingsCard({ settings, onChange }: AuthSettingsCardProps) {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadImage(formData).unwrap();
      
      if (res.success && res.url) {
        onChange("heroImage", res.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    onChange("heroImage", "");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 mb-6">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
            <LayoutTemplate className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Auth Pages Hero Settings</h2>
            <p className="text-sm text-slate-500">Configure the image and text shown on the login and register pages.</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column: Image */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Hero Image</label>
            {settings.heroImage ? (
              <div className="relative w-full aspect-[4/3] max-h-[220px] overflow-hidden rounded-lg border border-gray-200">
                <Image src={settings.heroImage} alt="Hero" fill className="object-contain bg-gray-50" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full aspect-[4/3] max-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-primary mb-2"></div>
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Click to upload</span>
                    <span className="text-xs">PNG, JPG, WebP up to 5MB</span>
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>

          {/* Right Column: Text Settings */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Main Heading</label>
              <input
                type="text"
                value={settings.heading || ""}
                onChange={(e) => onChange("heading", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                placeholder="e.g. Ascend to your"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Highlight 1</label>
                <input
                  type="text"
                  value={settings.headingHighlight1 || ""}
                  onChange={(e) => onChange("headingHighlight1", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. Academic"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Highlight 2</label>
                <input
                  type="text"
                  value={settings.headingHighlight2 || ""}
                  onChange={(e) => onChange("headingHighlight2", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. Zenith."
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={2}
                value={settings.description || ""}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                placeholder="Description text..."
              />
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">Footer Text</label>
              <input
                type="text"
                value={settings.footerText || ""}
                onChange={(e) => onChange("footerText", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                placeholder="© 2026 Ash Academy. All rights reserved."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
