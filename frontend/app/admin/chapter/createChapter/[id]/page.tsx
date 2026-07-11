"use client";

import { useState } from "react";
import { ChevronDown, Plus, Info, Video, Network } from "lucide-react";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";

interface ContentItem {
  id: number;
  title: string;
  sequence: number;
  fileType: string;
  fileName: string | null;
  isFree: boolean;
  fileUrl?: string | null;
  duration?: string | number | null;
}

export default function CreateChapter() {
  const [courseTitle, setCourseTitle] = useState(
    "Advance Adobe Illustrator Mastery Course",
  );
  const [chapterTitle, setChapterTitle] = useState("");
  const [serial, setSerial] = useState(1);
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 1,
      title: "",
      sequence: 1,
      fileType: "Upload Files",
      fileName: null,
      isFree: false,
      fileUrl: null,
      duration: null,
    },
  ]);

  const addContentItem = () => {
    const newItem: ContentItem = {
      id: contentItems.length + 1,
      title: "",
      sequence: contentItems.length + 1,
      fileType: "VideoAsset",
      fileName: null,
      isFree: false,
    };
    setContentItems([...contentItems, newItem]);
  };

  const updateContentItem = (id: number, field: string, value: any) => {
    setContentItems(
      contentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const { data: courses, isLoading, isError } = useGetAllCourseQuery();

  return (
    <div className="min-h-screen bg-white rounded-xl">
      {/* Main Content */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Course Selection Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Course Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Course Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 appearance-none cursor-pointer"
              >
                {courses?.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          {/* Chapter Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Chapter Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter chapter title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
            />
          </div>

          {/* Serial */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Serial <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={serial}
              onChange={(e) => setSerial(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
            />
          </div>
        </div>

        {/* Chapter Contents Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Chapter Contents
            </h2>
            {/* Per-item 'Free' toggle is shown per content row below */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Content Title
                    </span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left hidden sm:table-cell">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Seq.
                    </span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      File Type
                    </span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Free
                    </span>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Upload Asset
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {contentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <input
                        type="text"
                        placeholder="Enter content title"
                        value={item.title}
                        onChange={(e) =>
                          updateContentItem(item.id, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <input
                        type="number"
                        value={item.sequence}
                        onChange={(e) =>
                          updateContentItem(item.id, "sequence", Number(e.target.value))
                        }
                        className="w-16 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="relative">
                        <select
                          value={item.fileType}
                          onChange={(e) =>
                            updateContentItem(
                              item.id,
                              "fileType",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 appearance-none cursor-pointer text-sm"
                        >
                          <option>Upload Files</option>
                          <option>Cloud Link</option>
                        </select>
                        <ChevronDown
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={16}
                        />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isFree}
                        onChange={(e) =>
                          updateContentItem(item.id, "isFree", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600 cursor-pointer mx-auto"
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
                              const f = e.target.files?.[0];
                              if (f)
                                updateContentItem(item.id, "fileName", f.name);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`file-${item.id}`}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-gray-700 hover:border-gray-400 transition-colors text-sm cursor-pointer"
                          >
                            <Plus size={16} />
                            {item.fileName ? "Change" : "Choose"}
                          </label>
                          {item.fileName && (
                            <span className="text-sm text-gray-600 truncate max-w-xs">
                              {item.fileName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Upload link"
                            value={item.fileUrl ?? ""}
                            onChange={(e) =>
                              updateContentItem(
                                item.id,
                                "fileUrl",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Duration (mins)"
                            value={item.duration ?? ""}
                            onChange={(e) =>
                              updateContentItem(
                                item.id,
                                "duration",
                                e.target.value,
                              )
                            }
                            className="w-32 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Content Button */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={addContentItem}
              className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors font-medium text-sm"
            >
              <Plus size={18} />
              Add New Content Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
