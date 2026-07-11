"use client";

import { useState } from "react";
import {
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const chaptersData = [
  {
    id: 1,
    number: "01",
    title: "Adobe Illustrator Fundamentals",
    subtitle: "Introduction to the interface and tools",
    sequence: 9,
    lessons: 3,
  },
];

export default function ChaptersManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddNewChapter = () => {
    router.push(`/admin/chapter/createChapter/${chaptersData[0]?.id}`);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200">
        <p className="text-gray-600 text-sm sm:text-base">
          Showing chapters for:{" "}
          <span className="font-semibold">
            {chaptersData[0]?.title || "Unknown Chapter"}
          </span>
        </p>
      </div>
      {/* Main Content */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[70%] h-12 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Info and New Chapter Button */}
          <div className="flex items-center justify-between sm:justify-end gap-4 flex-wrap">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium whitespace-nowrap"
              onClick={() => {
                handleAddNewChapter();
              }}
            >
              <Plus size={18} />
              <span className="hidden sm:inline"> New Chapter</span>
              <span className="sm:hidden"> New</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg mb-8">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    #
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Chapter Title
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left hidden md:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Sequence
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Contents
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Action
                  </span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {chaptersData.map((chapter, index) => (
                <tr
                  key={chapter.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {chapter.number}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded text-primary flex-shrink-0 mt-0.5">
                        <Edit2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {chapter.title}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {chapter.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <span className="text-sm font-semibold text-gray-900">
                      {chapter.sequence}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {chapter.lessons} Lessons
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded transition-colors text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center border-t border-gray-100 px-5 py-4">
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  className="h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                />
              </PaginationItem>
              {[1, 2, 3].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    className={`h-8 w-8 rounded-lg text-sm ${
                      page === currentPage
                        ? "bg-primary! text-white! border-primary! hover:bg-violet-700!"
                        : "border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-8 w-8 rounded-lg text-sm border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                >
                  128
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  className="h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
