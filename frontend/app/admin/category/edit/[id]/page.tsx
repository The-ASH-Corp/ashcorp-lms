"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Upload, Plus, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  type Category,
} from "@/lib/redux/features/category/categoryApi";
import { getApiErrorMessage } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface CategoryFormData {
  categoryName: string;
  icon: File | null;
  color: string;
  isFeatured: boolean;
  status: string;
}

const getInitialFormState = (category?: Category): CategoryFormData => ({
  categoryName: category?.categoryName ?? "",
  icon: null,
  color: category?.color ?? "#7C3AED",
  isFeatured: Boolean(category?.isFeatured),
  status: category?.status ?? "Active",
});

function CategoryEditorForm({
  category,
  categoryId,
  onSubmit,
  isUpdating,
  onCancel,
}: {
  category?: Category;
  categoryId?: string;
  onSubmit: (payload: CategoryFormData) => Promise<void>;
  isUpdating: boolean;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryFormData>(() =>
    getInitialFormState(category),
  );
  const [iconPreview, setIconPreview] = useState<string | null>(category?.iconUrl ?? null);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, categoryName: e.target.value || "" }));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, color: e.target.value }));
  };

  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, icon: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setIconPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isFeatured: !prev.isFeatured }));
  };

  const handleStatusChange = (status: "Active" | "Inactive" | "On Hold") => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Category id is missing.");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
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
              Edit Category
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update details and icon for this category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Edit Category</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Category Title
                </label>
                <Input
                  type="text"
                  placeholder="Enter category title..."
                  value={formData.categoryName}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border !h-12 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 text-gray-900 placeholder-gray-400"
                />
              </div>

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
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Feature on Homepage</h3>
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
                        formData.isFeatured ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Status</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        {formData.status} <ChevronDown className="w-3.5 h-3.5 mr-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange("Active")}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange("Inactive")}>
                        Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange("On Hold")}>
                        On Hold
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  className="flex-1 px-6 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors !h-10"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 !h-10"
                  variant="default"
                  disabled={isUpdating}
                >
                  <Plus size={20} />
                  <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Live Preview</h2>

            <div className="space-y-8">
              <div
                style={{ backgroundColor: formData.color }}
                className="rounded-2xl p-8 min-h-64 flex flex-col items-center justify-center text-white relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                />

                <div className="w-16 h-16 bg-black bg-opacity-30 rounded-xl flex items-center justify-center mb-6 relative z-10">
                  {iconPreview ? (
                    <Image
                      src={iconPreview}
                      alt="Category icon"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                      unoptimized
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

                <h3 className="text-3xl font-bold text-center mb-3 relative z-10">
                  {formData.categoryName || "Category Title"}
                </h3>
              </div>

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

export default function EditCategoryPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const categoryId = params?.id;

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const category = categories.find((item) => item._id === categoryId);

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      const fd = new FormData();
      fd.append("categoryName", formData.categoryName);
      if (formData.icon) {
        fd.append("icon", formData.icon);
      }
      fd.append("color", formData.color);
      fd.append("isFeatured", formData.isFeatured.toString());
      fd.append("status", formData.status);
      fd.append("isPublished", "false");

      await updateCategory({ id: categoryId ?? "", formData: fd }).unwrap();
      toast.success("Category updated successfully");
      router.replace("/admin/category");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isCategoriesLoading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-600">Loading category...</div>;
  }

  return (
    <CategoryEditorForm
      key={category?._id ?? categoryId ?? "loading"}
      category={category}
      categoryId={categoryId}
      onSubmit={handleSubmit}
      isUpdating={isUpdating}
      onCancel={() => router.back()}
    />
  );
}
