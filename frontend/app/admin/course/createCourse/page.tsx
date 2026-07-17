"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Play, Info, Eye, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/admin/course/RichTextEditor";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useGetAllCategoriesQuery, type Category } from "@/lib/redux/features/category/categoryApi";
import { useGetAllInstructorsQuery, type Instructor } from "@/lib/redux/features/instructor/instructorApi";
import { allCategories } from "@/lib/redux/features/category/categorySlice";
import { getAllInstructors } from "@/lib/redux/features/instructor/instructorSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function CreateCoursePage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.allCategories) as Category[];
  const instructors = useAppSelector((state) => state.instructor.allInstructors) as Instructor[];
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  const { data: categoriesData } = useGetAllCategoriesQuery(undefined, {
    skip: categories.length > 0,
  });

  const { data: instructorsData } = useGetAllInstructorsQuery(undefined, {
    skip: instructors.length > 0,
  });

  const [formData, setFormData] = useState({
    courseTitle: "",
    category: "",
    instructor: "",
    regularPrice: "0.00",
    offerPrice: "0.00",
    description: "",
    isPublished: false,
  });

  const [sections, setSections] = useState([
    { id: 1, title: "About the Course", content: "" },
  ]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoriesData && categories.length === 0) {
      dispatch(allCategories(categoriesData));
    }
  }, [categoriesData, categories.length, dispatch]);

  useEffect(() => {
    if (instructorsData && instructors.length === 0) {
      dispatch(getAllInstructors(instructorsData));
    }
  }, [instructorsData, instructors.length, dispatch]);

  const selectedCategory = formData.category || categories[0]?._id || "";
  const selectedInstructor = formData.instructor || instructors[0]?._id || "";

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setVideoFile(file);
      setVideoName(file.name);
    }
  };

  const handleSectionTitleChange = (id: number, value: string) => {
    setSections((current) =>
      current.map((section) =>
        section.id === id ? { ...section, title: value } : section,
      ),
    );
  };

  const handleSectionContentChange = (id: number, content: string) => {
    setSections((current) =>
      current.map((section) =>
        section.id === id ? { ...section, content } : section,
      ),
    );
  };

  const addNewSection = () => {
    setSections((prev) => [
      ...prev,
      { id: prev.length + 1, title: "", content: "" },
    ]);
  };

  const handleRemoveSection = (id: number) => {
    setSections((current) => current.filter((section) => section.id !== id));
  };

  const handleSwitch = () => {
    setFormData((prev) => ({
      ...prev,
      isPublished: !prev.isPublished,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!thumbnailFile || !videoFile) {
      toast.error("Please upload a course thumbnail and intro video.");
      return;
    }

    if (!formData.courseTitle.trim()) {
      toast.error("Course title is required.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    if (!selectedInstructor) {
      toast.error("Please select an instructor.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formData.courseTitle);
    formPayload.append("description", formData.description);
    formPayload.append("price", formData.regularPrice || "0");
    formPayload.append("offerPrice", formData.offerPrice || "0");
    formPayload.append("instructor", selectedInstructor);
    formPayload.append("category", selectedCategory);
    formPayload.append(
      "chapters",
      JSON.stringify(
        sections.map((section) => section.title || `Section ${section.id}`),
      ),
    );
    formPayload.append("thumbnail", thumbnailFile);
    formPayload.append("introVideo", videoFile);

    const uploadUrl = apiBaseUrl
      ? `${apiBaseUrl.replace(/\/+$/, "")}/course/create`
      : "/api/course/create";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);
    xhr.withCredentials = true;

    if (token) {
      xhr.setRequestHeader("authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setIsSubmitting(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        toast.success("Course created successfully.");
        router.replace("/admin/course");
      } else {
        let message = "Upload failed. Please try again.";
        try {
          const response = JSON.parse(xhr.responseText);
          if (response?.message) {
            message = response.message;
          }
        } catch {
          message = xhr.statusText || message;
        }
        toast.error(message);
      }
    };

    xhr.onerror = () => {
      setIsSubmitting(false);
      toast.error("Upload failed. Please check your internet connection.");
    };

    setIsSubmitting(true);
    setUploadProgress(0);
    xhr.send(formPayload);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-gray-900 font-semibold mb-1 flex items-center gap-2">
                <span>Course Thumbnail</span>
                <span className="text-xs text-gray-500">550 x 200 · JPG PNG</span>
              </h3>
              <label
                htmlFor="course-thumbnail"
                className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50 min-h-48 flex flex-col items-center justify-center"
              >
                {thumbnailPreview ? (
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={400}
                    height={240}
                    className="max-h-40 w-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium mb-1">Drag & Drop Image</p>
                    <p className="text-gray-500 text-xs">or click to choose file</p>
                  </>
                )}
              </label>
              <input
                id="course-thumbnail"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <div className="mt-4 text-sm text-gray-600">
                {thumbnailFile ? thumbnailFile.name : "No thumbnail selected"}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-gray-900 font-semibold mb-1 flex items-center gap-2">
                <span>Intro Video</span>
                <span className="text-xs text-gray-500">MP4, MOV, AVI · Max 2GB</span>
              </h3>
              <label
                htmlFor="course-video"
                className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50 min-h-48 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <Play size={24} className="text-gray-500" fill="currentColor" />
                </div>
                <p className="text-gray-600 font-medium">Select or drop your video</p>
                <p className="text-gray-500 text-xs mt-1">
                  {videoName || "No file selected"}
                </p>
              </label>
              <input
                id="course-video"
                type="file"
                accept="video/mp4,video/quicktime,video/x-m4v,video/x-msvideo,video/x-matroska"
                onChange={handleVideoChange}
                className="hidden"
              />

              {uploadProgress > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-violet-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-primary text-xs font-medium">
                    Upload progress: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-gray-900 font-semibold mb-6 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              General Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Advanced Quantum Algorithms for Fintech"
                  className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={selectedCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat: Category) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Categories Available
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Instructor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="instructor"
                    value={selectedInstructor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                  >
                    {instructors.length > 0 ? (
                      instructors.map((ins: Instructor) => (
                        <option key={ins._id} value={ins._id}>
                          {ins.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Instructors Available
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Price ($)
                  </label>
                  <Input
                    type="text"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    placeholder="$ 0.00"
                    className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Offer Price ($)
                  </label>
                  <Input
                    type="text"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleInputChange}
                    placeholder="$ 0.00"
                    className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {sections.map((section, index) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                  {index === 0 ? "About the Course" : `Section ${index}`}
                </h3>
                {index > 0 && (
                  <button
                    type="button"
                    className="text-red-600 text-sm font-medium hover:text-red-700"
                    onClick={() => handleRemoveSection(section.id)}
                  >
                    Remove Section
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {(
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-2">
                      Section Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        handleSectionTitleChange(section.id, e.target.value)
                      }
                      placeholder="e.g. Introduction to Neural Architectures"
                      className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={index === 0 ? formData.description : section.content}
                    onChange={(content) =>
                      index === 0
                        ? setFormData((prev) => ({ ...prev, description: content }))
                        : handleSectionContentChange(section.id, content)
                    }
                    placeholder={
                      index === 0
                        ? "Describe the course overview..."
                        : "Write a short section summary..."
                    }
                    className="min-h-55"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addNewSection}
            className="w-full border border-dashed border-gray-300 rounded-lg py-4 sm:py-6 text-primary font-medium hover:border-primary hover:bg-violet-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={18} />
            Add New Section
          </button>

          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 sm:gap-4">
                <Eye size={20} className="text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-gray-900 font-semibold text-sm sm:text-base">
                    Publish Settings
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Control who can see this course in the marketplace.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSwitch}
                className={`shrink-0 w-12 h-7 rounded-full transition-colors ${
                  formData.isPublished ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    formData.isPublished ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 items-end justify-end">
            {isSubmitting && (
              <div className="w-full sm:max-w-xs space-y-2">
                <div className="h-2 rounded-full bg-violet-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-primary text-xs font-medium">
                  Upload progress: {uploadProgress}%
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium flex-1 sm:flex-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              {isSubmitting ? "Uploading..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
