"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import {
  useGetChaptersByCourseIdQuery,
  useUpdateChapterMutation,
} from "@/lib/redux/features/chapter/chapterApi";

interface ContentItem {
  id: number;
  title: string;
  sequence: number;
  fileType: string;
  fileName: string | null;
  file: File | null;
  isFree: boolean;
  fileUrl?: string | null;
  duration?: string | number | null;
  hasNewFile?: boolean;
}

interface ChapterFormState {
  selectedCourseId: string;
  chapterTitle: string;
  serial: number;
  contentItems: ContentItem[];
}

export default function EditChapterPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = params?.id;
  const courseIdFromRoute = searchParams.get("courseId") ?? "";
  const courseTitleFromRoute = searchParams.get("title") ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: courses } = useGetAllCourseQuery();
  const { data: chapters } = useGetChaptersByCourseIdQuery(courseIdFromRoute || "", {
    skip: !courseIdFromRoute,
  });
  const [updateChapter] = useUpdateChapterMutation();

  const chapter = useMemo(() => {
    if (!chapters || !chapterId) return undefined;
    return chapters.find((item) => item._id === chapterId);
  }, [chapters, chapterId]);

  const initialFormState = useMemo<ChapterFormState>(() => ({
    selectedCourseId: chapter?.courseId ?? courseIdFromRoute,
    chapterTitle: chapter?.title ?? "",
    serial: Number(chapter?.serialNumber) || 1,
    contentItems: (chapter?.contents ?? []).map((content, index) => ({
      id: index + 1,
      title: content.contentTitle ?? "",
      sequence: Number(content.sequance) || index + 1,
      fileType: content.contentUrl?.includes("http") ? "Cloud Link" : "Upload Files",
      fileName: null,
      file: null,
      isFree: Boolean(content.isFree),
      fileUrl: content.contentUrl ?? "",
      duration: content.duration ?? null,
    })),
  }), [chapter, courseIdFromRoute]);

  const [formState, setFormState] = useState<ChapterFormState>(initialFormState);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormState(initialFormState);
  }, [initialFormState]);

  const updateFormState = (updates: Partial<ChapterFormState>) => {
    setFormState((current) => ({ ...current, ...updates }));
  };

  const addContentItem = () => {
    setFormState((current) => ({
      ...current,
      contentItems: [
        ...current.contentItems,
        {
          id: current.contentItems.length + 1,
          title: "",
          sequence: current.contentItems.length + 1,
          fileType: "Upload Files",
          fileName: null,
          file: null,
          isFree: false,
          fileUrl: "",
          duration: null,
        },
      ],
    }));
  };

  const updateContentItem = (
    id: number,
    field: string,
    value: string | number | boolean | File | null,
  ) => {
    setFormState((current) => ({
      ...current,
      contentItems: current.contentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleSaveChapter = async () => {
    if (!chapterId) return toast.error("Chapter id is missing");
    if (!formState.selectedCourseId) return toast.error("Please select a course");
    if (!formState.chapterTitle.trim()) return toast.error("Please enter chapter title");
    if (!formState.contentItems.length) return toast.error("Add at least one content item");

    for (const [idx, content] of formState.contentItems.entries()) {
      if (!content.title.trim()) {
        return toast.error(`Content #${idx + 1}: title is required`);
      }
      if (!content.sequence || Number.isNaN(Number(content.sequence))) {
        return toast.error(`Content #${idx + 1}: sequence is invalid`);
      }
      if (content.fileType === "Upload Files") {
        if (!content.file && !content.fileUrl) {
          return toast.error(`Content #${idx + 1}: choose a file or keep the existing link`);
        }
      } else if (!content.fileUrl?.trim()) {
        return toast.error(`Content #${idx + 1}: provide a cloud link`);
      }
    }

    const selectedCourse = courses?.find((course) => course.id === formState.selectedCourseId);
    const formData = new FormData();
    const contents = formState.contentItems.map((content) => ({
      contentTitle: content.title,
      sequance: Number(content.sequence),
      contentUrl: content.fileUrl ?? "",
      isFree: content.isFree,
      duration:
        content.duration === undefined || content.duration === null || content.duration === ""
          ? null
          : Number(content.duration),
      uploadType: content.fileType === "Upload Files" ? "file" : "link",
      hasNewFile: Boolean(content.file),
    }));

    formData.append("courseId", formState.selectedCourseId);
    formData.append("courseTitle", selectedCourse?.title ?? courseTitleFromRoute ?? "");
    formData.append("title", formState.chapterTitle);
    formData.append("description", "");
    formData.append("videoUrl", "");
    formData.append("serialNumber", String(formState.serial));
    formData.append("contents", JSON.stringify(contents));

    formState.contentItems.forEach((item) => {
      if (item.fileType === "Upload Files" && item.file) {
        formData.append("files", item.file);
      }
    });

    try {
      setIsSubmitting(true);
      await updateChapter({ id: chapterId, chapter: formData }).unwrap();
      toast.success("Chapter updated successfully");
      router.push(`/admin/chapter/list/${formState.selectedCourseId}?title=${encodeURIComponent(selectedCourse?.title ?? courseTitleFromRoute)}`);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update chapter";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Course Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formState.selectedCourseId}
                onChange={(e) => updateFormState({ selectedCourseId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
              >
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Chapter Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter chapter title"
              value={formState.chapterTitle}
              onChange={(e) => updateFormState({ chapterTitle: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Serial <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formState.serial}
              onChange={(e) => updateFormState({ serial: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Chapter Contents</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Content Title</span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left hidden sm:table-cell">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Seq.</span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">File Type</span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Free</span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Upload Asset</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {formState.contentItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <input
                        type="text"
                        placeholder="Enter content title"
                        value={item.title}
                        onChange={(e) => updateContentItem(item.id, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <input
                        type="number"
                        value={item.sequence}
                        onChange={(e) => updateContentItem(item.id, "sequence", Number(e.target.value))}
                        className="w-16 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="relative">
                        <select
                          value={item.fileType}
                          onChange={(e) => updateContentItem(item.id, "fileType", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-sm"
                        >
                          <option>Upload Files</option>
                          <option>Cloud Link</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isFree}
                        onChange={(e) => updateContentItem(item.id, "isFree", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer mx-auto"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {item.fileType === "Upload Files" ? (
                        <div className="flex items-center gap-3">
                          <input
                            id={`file-${item.id}`}
                            type="file"
                            accept="video/*,audio/*,image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              updateContentItem(item.id, "fileName", file?.name ?? null);
                              updateContentItem(item.id, "file", file);
                              updateContentItem(item.id, "hasNewFile", Boolean(file));
                            }}
                            className="hidden"
                          />
                          <label htmlFor={`file-${item.id}`} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-gray-700 hover:border-gray-400 transition-colors text-sm cursor-pointer">
                            <Plus size={16} />
                            {item.fileName ? "Change" : "Choose"}
                          </label>
                          {item.fileName && <p className="text-sm text-gray-700 truncate max-w-xs">{item.fileName}</p>}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Upload link"
                            value={item.fileUrl ?? ""}
                            onChange={(e) => updateContentItem(item.id, "fileUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Duration (mins)"
                            value={item.duration ?? ""}
                            onChange={(e) => updateContentItem(item.id, "duration", e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
            <button
              onClick={addContentItem}
              className="flex items-center gap-2 text-primary hover:text-violet-700 transition-colors font-medium text-sm"
              type="button"
            >
              <Plus size={18} />
              Add New Content Item
            </button>
            <button
              onClick={handleSaveChapter}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
            >
              {isSubmitting ? "Updating..." : "Update Chapter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
