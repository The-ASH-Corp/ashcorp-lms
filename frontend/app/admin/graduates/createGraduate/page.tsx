"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, User, Briefcase, Building2, Sparkles, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createGraduateSchema } from "@/lib/validations/graduate";
import { useCreateGraduateMutation } from "@/lib/redux/features/graduate/graduateApi";
import { toast } from "sonner";
import Link from "next/link";

const initialFormData = {
  name: "",
  positionName: "",
  image: "",
  companyLogo: "",
  featureOnLandingPage: false,
};

type FormData = typeof initialFormData;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CreateGraduatePage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const [createGraduate, { isLoading }] = useCreateGraduateMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      featureOnLandingPage: !prev.featureOnLandingPage,
    }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "companyLogo",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({
            ...prev,
            [field]: reader.result as string,
          }));
          if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = createGraduateSchema.safeParse(formData);

    if (!validationResult.success) {
      const nextErrors: FormErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FormErrors;
        if (typeof fieldName === "string") {
          nextErrors[fieldName] = issue.message;
        }
      });
      setErrors(nextErrors);
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setErrors({});

    try {
      await createGraduate({
        name: formData.name.trim(),
        positionName: formData.positionName.trim(),
        image: formData.image.trim(),
        companyLogo: formData.companyLogo.trim(),
        featureOnLandingPage: formData.featureOnLandingPage,
      }).unwrap();

      toast.success("Graduate card created successfully!");
      router.push("/admin/graduates");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create graduate card");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Create Graduate Spotlight
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Add a new placed graduate to feature their success story
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Graduate Information Section */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-primary flex items-center justify-center font-semibold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Graduate Details
                    </h2>
                    <p className="text-xs text-gray-500">
                      Basic information about the placed graduate
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Graduate Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Alex Johnson"
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-hidden transition-all text-sm"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>
                    )}
                  </div>

                  {/* Position Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Position Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="positionName"
                        value={formData.positionName}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Frontend Engineer at Google"
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-hidden transition-all text-sm"
                      />
                    </div>
                    {errors.positionName && (
                      <p className="text-xs text-red-500 mt-1.5">
                        {errors.positionName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Section (Images & Logos) */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-primary flex items-center justify-center font-semibold">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Media Assets
                    </h2>
                    <p className="text-xs text-gray-500">
                      Graduate portrait photo and hiring company logo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Graduate Image */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Graduate Image <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-primary/60 transition-colors bg-gray-50/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "image")}
                          className="hidden"
                          id="graduate-image-upload"
                        />
                        <label
                          htmlFor="graduate-image-upload"
                          className="cursor-pointer block"
                        >
                          <Upload className="mx-auto mb-2 text-gray-400 w-6 h-6" />
                          <p className="text-xs text-gray-600 font-medium">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </label>
                      </div>

                      <div className="relative">
                        <Input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="Or paste image URL"
                          className="w-full h-10 px-3 text-xs rounded-lg border border-gray-300 focus:border-primary"
                        />
                      </div>
                    </div>
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1.5">{errors.image}</p>
                    )}
                  </div>

                  {/* Company Logo */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Company Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-primary/60 transition-colors bg-gray-50/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "companyLogo")}
                          className="hidden"
                          id="company-logo-upload"
                        />
                        <label
                          htmlFor="company-logo-upload"
                          className="cursor-pointer block"
                        >
                          <Building2 className="mx-auto mb-2 text-gray-400 w-6 h-6" />
                          <p className="text-xs text-gray-600 font-medium">
                            Click to upload company logo
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            PNG, SVG, WEBP transparent
                          </p>
                        </label>
                      </div>

                      <div className="relative">
                        <Input
                          type="text"
                          name="companyLogo"
                          value={formData.companyLogo}
                          onChange={handleInputChange}
                          placeholder="Or paste company logo URL"
                          className="w-full h-10 px-3 text-xs rounded-lg border border-gray-300 focus:border-primary"
                        />
                      </div>
                    </div>
                    {errors.companyLogo && (
                      <p className="text-xs text-red-500 mt-1.5">
                        {errors.companyLogo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-primary flex items-center justify-center font-semibold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        Feature on Landing Page
                      </h2>
                      <p className="text-xs text-gray-500">
                        Display this graduate in the landing page showcase carousel
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-hidden ${
                      formData.featureOnLandingPage ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.featureOnLandingPage ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <Link
                  href="/admin/graduates"
                  className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-violet-700 font-semibold text-sm transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Graduate Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card Sidebar (4 Columns) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-8">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Live Card Preview
              </h3>

              {/* Preview Graduate Card */}
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900 group mx-auto max-w-xs">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt={formData.name || "Graduate image preview"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400 p-4 text-center">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-xs">No graduate image selected</p>
                  </div>
                )}

                {/* Violet Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900/80 via-violet-800/40 to-transparent opacity-80" />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                  {/* Top Section */}
                  <div>
                    <h4 className="text-white text-3xl font-bold tracking-tight">Placed</h4>
                    <h4 className="text-white text-3xl font-bold tracking-tight">as</h4>
                    <p className="text-white text-base font-medium mt-2 line-clamp-2">
                      {formData.positionName || "Position Name"}
                    </p>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Company Logo */}
                    <div className="bg-white/90 backdrop-blur-xs rounded-xl w-14 h-14 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      {formData.companyLogo ? (
                        <Image
                          src={formData.companyLogo}
                          alt="Company Logo"
                          width={48}
                          height={48}
                          className="object-contain max-h-full"
                          unoptimized
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Name Badge */}
                    <div className="bg-white rounded-full px-4 py-2 shadow-sm max-w-[170px] truncate">
                      <p className="text-gray-900 font-semibold text-xs truncate">
                        {formData.name || "Graduate Name"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {formData.featureOnLandingPage && (
                <div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100 flex items-center gap-2 text-xs text-primary font-medium">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Featured on Landing Page Showcase
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
