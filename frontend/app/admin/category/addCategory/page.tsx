"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/lib/redux/features/category/categoryApi";
import { getApiErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CategoryFormData {
  categoryName: string;
  icon: File | null;
  color: string;
  isFeatured: boolean;
}

export default function CreateCategoryPage() {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "Your Title Here",
    icon: null,
    color: "#7C3AED",
    isFeatured: false,
  });
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const router = useRouter();



  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, categoryName: e.target.value || "Your Title Here" });
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, color: e.target.value });
  };

  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, icon: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setIconPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggle = () => {
    setFormData({
      ...formData,
      isFeatured: !formData.isFeatured,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("categoryName", formData.categoryName);
      if (formData.icon) {
        fd.append("icon", formData.icon);
      }
      fd.append("color", formData.color);
      fd.append("isFeatured", formData.isFeatured.toString());
      await createCategory(fd).unwrap();
      toast.success("Category created successfully");
      router.replace("/admin/category");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">
              Create Category
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Category Title
                </label>
                <Input
                  type="text"
                  placeholder="Enter category title..."
                  value={
                    formData.categoryName === "Your Title Here" ? "" : formData.categoryName
                  }
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border !h-12 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Category Icon (JPG, JPEG, PNG)
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleIconUpload}
                    className="hidden"
                    id="icon-upload"
                  />
                  <label
                    htmlFor="icon-upload"
                    className="flex flex-col items-center justify-center px-4 py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-violet-50 cursor-pointer transition-colors bg-gray-50"
                  >
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">
                      Choose File or Drop here
                    </span>
                    <span className="text-xs text-gray-500 mt-2">
                      Recommended size: 512x512px
                    </span>
                  </label>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Background Color
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={handleColorChange}
                      className="w-full px-4 py-3 !h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-gray-900 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={handleColorChange}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This color defines the card&apos;s accent in student view.
                </p>
              </div>

              {/* Feature on Homepage Toggle */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Feature on Homepage
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Promote this category in the &apos;Popular&apos; section
                      of the learner dashboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
                      formData.isFeatured ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        formData.isFeatured
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  className="flex-1 px-6 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors !h-10"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 !h-10"
                  variant="default"
                >
                  <Plus size={20} />
                  <span>Create Category</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">
              Live Preview
            </h2>

            <div className="space-y-8">
              {/* Preview Card */}
              <div
                style={{ backgroundColor: formData.color }}
                className="rounded-2xl p-8 min-h-64 flex flex-col items-center justify-center text-white relative overflow-hidden"
              >
                {/* Decorative circles */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                />

                {/* Icon */}
                <div className="w-16 h-16 bg-black bg-opacity-30 rounded-xl flex items-center justify-center mb-6 relative z-10">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Category icon"
                      className="w-10 h-10"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-center mb-3 relative z-10">
                  {formData.categoryName}
                </h3>
              </div>

              {/* Description */}
              <p className="text-center text-gray-600 italic">
                Learners will see this in the academy catalog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
