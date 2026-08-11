"use client";

import React, { useState } from "react";
import { Users, Plus, Trash2, Power, Upload, User, Image as ImageIcon, Loader2 } from "lucide-react";
import { IAboutPageSettings, IVisionary } from "./aboutSettingsTypes";
import { useUploadImageMutation } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { toast } from "sonner";

interface LeadershipCardProps {
  leadership: IAboutPageSettings["leadership"];
  onChange: (updated: IAboutPageSettings["leadership"]) => void;
}

export function LeadershipCard({
  leadership,
  onChange,
}: LeadershipCardProps) {
  const isEnabled = leadership?.enabled ?? true;
  const items = leadership?.items || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newImage, setNewImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImage] = useUploadImageMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadImage(formData).unwrap();
      
      if (result.success && result.url) {
        // Ensure absolute URL if backend returns relative path
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        const backendBaseUrl = apiBaseUrl.replace(/\/api$/, "");
        
        const imageUrl = result.url.startsWith("http") 
          ? result.url 
          : `${backendBaseUrl}${result.url.startsWith("/") ? "" : "/"}${result.url}`;
          
        setNewImage(imageUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddVisionary = () => {
    if (!newName.trim() || !newRole.trim()) return;

    const newItem: IVisionary = {
      id: `vis-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      image: newImage.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    };

    onChange({
      ...leadership,
      items: [...items, newItem],
    });

    setNewName("");
    setNewRole("");
    setNewImage("");
    setShowAddForm(false);
  };

  const handleDeleteVisionary = (id: string) => {
    onChange({
      ...leadership,
      items: items.filter((item) => item.id !== id),
    });
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Users className="size-4 text-violet-600" />
          Meet Our Visionaries
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Visionary
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...leadership, enabled: !isEnabled })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              isEnabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {isEnabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <p className="mb-4 text-xs text-slate-500">
        Manage the profiles displayed in the leadership grid. Images are securely uploaded to the server's uploads folder.
      </p>

      <div
        className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Add Visionary Form */}
        {showAddForm && (
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-900">
              Add New Visionary
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  placeholder="e.g. Sufail P"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                  placeholder="e.g. Founder & CEO"
                />
              </div>
            </div>

            {/* Local Image Upload */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Avatar Image (Local Upload / Storage)
              </label>
              <div className="flex items-center gap-3">
                {newImage ? (
                  <div className="relative size-12 rounded-xl overflow-hidden border border-violet-200">
                    {/* eslint-disable-next-html-element-for-img */}
                    <img src={newImage} alt="Preview" className="size-full object-cover" />
                  </div>
                ) : (
                  <div className="grid size-12 place-items-center rounded-xl bg-violet-50 text-violet-500 border border-violet-100">
                    <User className="size-5" />
                  </div>
                )}

                <label className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 px-3.5 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                  {isUploading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-3.5" />
                      Upload Image
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVisionary}
                className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 cursor-pointer"
              >
                Save Visionary
              </button>
            </div>
          </div>
        )}

        {/* Visionaries Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs hover:border-violet-200 hover:shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => handleDeleteVisionary(item.id)}
                className="absolute top-2 right-2 hidden rounded-lg bg-rose-50 p-1 text-rose-500 hover:bg-rose-100 group-hover:block cursor-pointer transition-colors"
                title="Remove Visionary"
              >
                <Trash2 className="size-3.5" />
              </button>

              <div className="relative mb-2.5 size-16 overflow-hidden rounded-2xl border-2 border-violet-100 shadow-xs bg-slate-100">
                {item.image ? (
                  /* eslint-disable-next-html-element-for-img */
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center bg-violet-50 text-violet-600">
                    <User className="size-8" />
                  </div>
                )}
              </div>

              <div className="w-full truncate">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {item.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 truncate">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
