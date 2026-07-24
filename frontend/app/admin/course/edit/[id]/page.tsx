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
import { useParams, useRouter } from "next/navigation";
import {
  useGetCourseQuery,
  useUpdateCourseMutation,
} from "@/lib/redux/features/course/courseApi";

const normalizeComparable = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/gi, "");

const extractRefValue = (value: unknown, fallbackNameKey: string) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const typedValue = value as { _id?: string; id?: string; [key: string]: unknown };
    if (typeof typedValue._id === "string") return typedValue._id;
    if (typeof typedValue.id === "string") return typedValue.id;
    const fallback = typedValue[fallbackNameKey];
    if (typeof fallback === "string") return fallback;
  }
  return "";
};

const normalizeCategoryValue = (value: unknown, categories: Category[]) => {
  const raw = extractRefValue(value, "categoryName");
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const byId = categories.find((category) => category._id === trimmed);
  if (byId) return byId._id;

  const normalizedInput = normalizeComparable(trimmed);
  const byName = categories.find(
    (category) => normalizeComparable(category.categoryName) === normalizedInput,
  );
  return byName?._id ?? "";
};

const normalizeInstructorValue = (value: unknown, instructors: Instructor[]) => {
  const raw = extractRefValue(value, "name");
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const byId = instructors.find((instructor) => instructor._id === trimmed);
  if (byId) return byId._id;

  const normalizedInput = normalizeComparable(trimmed);
  const byName = instructors.find(
    (instructor) => normalizeComparable(instructor.name) === normalizedInput,
  );
  return byName?._id ?? "";
};

export default function EditCoursePage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const courseId = params?.id;
  const categories = useAppSelector((state) => state.category.allCategories) as Category[];
  const instructors = useAppSelector((state) => state.instructor.allInstructors) as Instructor[];

  const { data: categoriesData } = useGetAllCategoriesQuery(undefined, {
    skip: categories.length > 0,
  });

  const { data: instructorsData } = useGetAllInstructorsQuery(undefined, {
    skip: instructors.length > 0,
  });

  const { data: courseData, isLoading: isCourseLoading } = useGetCourseQuery(courseId ?? "", {
    skip: !courseId,
  });
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [formData, setFormData] = useState({
    courseTitle: "",
    category: "",
    instructor: "",
    regularPrice: "0.00",
    offerPrice: "0.00",
    description: "",
    isPublished: false,
  });

  const [sections, setSections] = useState([{ id: 1, title: "About the Course", content: "" }]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  useEffect(() => {
    if (!courseData) {
      return;
    }

    const nextFormData = {
      courseTitle: courseData.title ?? "",
      category: extractRefValue(courseData.category, "categoryName"),
      instructor: extractRefValue(courseData.instructor, "name"),
      regularPrice: String(courseData.price ?? 0),
      offerPrice: String(courseData.offerPrice ?? 0),
      description: courseData.description ?? "",
      isPublished: Boolean(courseData.isPublished),
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(nextFormData);
    setThumbnailPreview(courseData.imageUrl ?? null);
    setVideoName(courseData.videoUrl ?? null);
    setSections((prev) =>
      prev.length > 1 || prev[0]?.title !== "About the Course"
        ? [{ id: 1, title: "About the Course", content: "" }]
        : prev,
    );
  }, [courseData]);

  const normalizedCategoryId = normalizeCategoryValue(formData.category, categories);
  const normalizedInstructorId = normalizeInstructorValue(formData.instructor, instructors);

  const selectedCategory = normalizedCategoryId;
  const selectedInstructor = normalizedInstructorId || instructors[0]?._id || "";

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
    setSections((current) => current.map((section) => (section.id === id ? { ...section, title: value } : section)));
  };

  const handleSectionContentChange = (id: number, content: string) => {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, content } : section)));
  };

  const addNewSection = () => {
    setSections((prev) => [...prev, { id: prev.length + 1, title: "", content: "" }]);
  };

  const handleRemoveSection = (id: number) => {
    setSections((current) => current.filter((section) => section.id !== id));
  };

  const handleSwitch = () => {
    setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    formPayload.append("isPublished", String(formData.isPublished));

    if (thumbnailFile) {
      formPayload.append("thumbnail", thumbnailFile);
    }

    if (videoFile) {
      formPayload.append("introVideo", videoFile);
    }

    if (!courseId) {
      toast.error("Course id is missing.");
      return;
    }

    try {
      await updateCourse({ id: courseId, formData: formPayload }).unwrap();
      setUploadProgress(100);
      toast.success("Course updated successfully.");
      router.replace("/admin/course");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Update failed. Please try again.";
      toast.error(message);
    }
  };

  if (isCourseLoading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-600">Loading course...</div>;
  }

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
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 font-medium mb-1">Drag & Drop Image</p>
                    <p className="text-gray-500 text-xs">or click to choose file</p>
                  </>
                )}
              </label>
              <input id="course-thumbnail" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleThumbnailChange} className="hidden" />
              <div className="mt-4 text-sm text-gray-600">{thumbnailFile ? thumbnailFile.name : "No thumbnail selected"}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-gray-900 font-semibold mb-1 flex items-center gap-2">
                <span>Intro Video</span>
                <span className="text-xs text-gray-500">MP4, MOV, AVI · Max 2GB</span>
              </h3>
              <label htmlFor="course-video" className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50 min-h-48 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <Play size={24} className="text-gray-500" fill="currentColor" />
                </div>
                <p className="text-gray-600 font-medium">Select or drop your video</p>
                <p className="text-gray-500 text-xs mt-1">{videoName || "No file selected"}</p>
              </label>
              <input id="course-video" type="file" accept="video/mp4,video/quicktime,video/x-m4v,video/x-msvideo,video/x-matroska" onChange={handleVideoChange} className="hidden" />
              {uploadProgress > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-violet-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-primary text-xs font-medium">Upload progress: {uploadProgress}%</p>
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
                <label className="block text-gray-700 font-medium text-sm mb-2">Course Title <span className="text-red-500">*</span></label>
                <Input type="text" name="courseTitle" value={formData.courseTitle} onChange={handleInputChange} placeholder="e.g. Advanced Quantum Algorithms for Fintech" className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Category <span className="text-red-500">*</span></label>
                  <select name="category" value={selectedCategory} onChange={handleInputChange} className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white">
                    {categories.length > 0 ? (
                      <>
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat: Category) => <option key={cat._id} value={cat._id}>{cat.categoryName}</option>)}
                      </>
                    ) : <option value="" disabled>No Categories Available</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Instructor <span className="text-red-500">*</span></label>
                  <select name="instructor" value={selectedInstructor} onChange={handleInputChange} className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white">
                    {instructors.length > 0 ? instructors.map((ins: Instructor) => <option key={ins._id} value={ins._id}>{ins.name}</option>) : <option value="" disabled>No Instructors Available</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Price ($)</label>
                  <Input type="text" name="regularPrice" value={formData.regularPrice} onChange={handleInputChange} placeholder="$ 0.00" className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Offer Price ($)</label>
                  <Input type="text" name="offerPrice" value={formData.offerPrice} onChange={handleInputChange} placeholder="$ 0.00" className="w-full h-12 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium text-sm mb-2">Course Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Write about the course"
                />
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Publish Course</p>
                    <p className="text-sm text-gray-500">Enable this to make the course visible to learners.</p>
                  </div>
                  <button type="button" onClick={handleSwitch} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.isPublished ? "bg-primary" : "bg-gray-300"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${formData.isPublished ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                <Eye size={20} className="text-primary" />
                Course Sections
              </h3>
              <button type="button" onClick={addNewSection} className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Plus size={16} />
                Add Section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <input type="text" value={section.title} onChange={(e) => handleSectionTitleChange(section.id, e.target.value)} placeholder="Section title" className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none" />
                    {sections.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSection(section.id)} className="text-sm text-red-500">Remove</button>
                    )}
                  </div>
                  <RichTextEditor value={section.content} onChange={(content) => handleSectionContentChange(section.id, content)} placeholder="Section content" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isUpdating} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
