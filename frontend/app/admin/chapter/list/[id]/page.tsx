"use client";

import { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus, X } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import {
  useDeleteChapterMutation,
  useGetPaginatedChaptersByCourseIdQuery,
} from "@/lib/redux/features/chapter/chapterApi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

const CHAPTERS_PER_PAGE = 10;


export default function ChaptersManagement() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const searchParams = useSearchParams();
  const courseId = params?.id;
  const courseTitleFromRoute = searchParams.get("title") ?? "";
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginatedData, isLoading } = useGetPaginatedChaptersByCourseIdQuery(
    {
      courseId: courseId ?? "",
      page: currentPage,
      limit: CHAPTERS_PER_PAGE,
      search: searchTerm,
    },
    { skip: !courseId },
  );
  const { data: courses } = useGetAllCourseQuery(undefined, {
    skip: Boolean(courseTitleFromRoute),
  });
  const [deleteChapter, { isLoading: isDeletingChapter }] =
    useDeleteChapterMutation();

  type ExtendedChapter = {
    _id: string;
    title: string;
    description?: string;
    serialNumber?: number;
    contents?: Array<{ contentTitle?: string; sequance?: number }>;
  };

  const chapters = (paginatedData?.data ?? []) as unknown as ExtendedChapter[];
  const totalChapters = paginatedData?.pagination.totalChapters ?? 0;
  const totalPages = paginatedData?.pagination.totalPages ?? 1;

  const resolvedCurrentPage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages],
  );

  const paginationItems = useMemo<Array<number | "ellipsis">>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages]);

    for (let offset = -1; offset <= 1; offset += 1) {
      const page = resolvedCurrentPage + offset;
      if (page > 1 && page < totalPages) {
        pages.add(page);
      }
    }

    const sortedPages = Array.from(pages).sort((left, right) => left - right);
    const items: Array<number | "ellipsis"> = [];

    sortedPages.forEach((page, index) => {
      const previousPage = sortedPages[index - 1];
      if (typeof previousPage === "number" && page - previousPage > 1) {
        items.push("ellipsis");
      }

      items.push(page);
    });

    return items;
  }, [resolvedCurrentPage, totalPages]);
  const courseTitle = useMemo(() => {
    if (courseTitleFromRoute) {
      return courseTitleFromRoute;
    }

    const resolvedCourse = courses?.find(
      (course) => course.id === courseId || (course as { _id?: string })._id === courseId,
    );

    return resolvedCourse?.title ?? courseId ?? "Unknown Course";
  }, [courseId, courseTitleFromRoute, courses]);

  const handleAddNewChapter = () => {
    if (!courseId) return;
    router.push(`/admin/chapter/createChapter/${courseId}`);
  };

  const handleEditChapter = (chapterId: string) => {
    if (!courseId) return;
    router.push(`/admin/chapter/edit/${chapterId}?courseId=${courseId}&title=${encodeURIComponent(courseTitle)}`);
  };

  const applySearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch();
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      await deleteChapter(chapterId).unwrap();
      if (chapters.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
      toast.success("Chapter deleted successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to delete chapter";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200">
        <p className="text-gray-600 text-sm sm:text-base">
          Showing chapters for: {" "}
          <span className="font-semibold">{courseTitle}</span>
        </p>
      </div>
      {/* Main Content */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search chapters..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-[70%] h-12 pl-10 pr-24 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900"
              />
              <div className="absolute right-[30%] top-1/2 flex -translate-y-1/2 items-center gap-1 pr-2">
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-violet-50 hover:text-primary"
                >
                  <Search size={16} />
                </button>
                {(searchInput || searchTerm) && (
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                    onClick={clearSearch}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
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
                <th className="px-4 sm:px-6 py-4 text-left align-middle">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    #
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left align-middle">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Chapter Title
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left align-middle hidden md:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Serial
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left align-middle">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Contents
                  </span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left align-middle">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Action
                  </span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Loading chapters...
                  </td>
                </tr>
              ) : chapters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    {searchTerm ? "No chapters match your search." : "No chapters found for this course."}
                  </td>
                </tr>
              ) : (
                chapters.map((chapter, index) => (
                  <tr
                    key={chapter._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 align-middle">
                      <span className="text-sm font-semibold text-gray-900">
                        {(resolvedCurrentPage - 1) * CHAPTERS_PER_PAGE + index + 1}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded text-primary shrink-0 mt-0.5">
                          <Edit2 size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {chapter.title}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-middle hidden md:table-cell">
                      <span className="text-sm font-semibold text-gray-900">{chapter.serialNumber ?? "-"}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-middle">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {chapter.contents?.length ?? 0} Lessons
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600"
                          onClick={() => handleEditChapter(chapter._id)}
                          type="button"
                        >
                          <Edit2 size={16} />
                        </button>
                        <ConfirmActionDialog
                          title="Delete Chapter"
                          description={`This will permanently delete ${chapter.title}.`}
                          confirmLabel="Delete"
                          loading={isDeletingChapter}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDeleteChapter(chapter._id)}
                          trigger={
                            <button className="p-2 hover:bg-red-50 rounded transition-colors text-red-600">
                              <Trash2 size={16} />
                            </button>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                />
              </PaginationItem>
              {paginationItems.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === resolvedCurrentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage(item);
                      }}
                      className={`h-8 w-8 rounded-lg text-sm ${
                        item === resolvedCurrentPage
                          ? "bg-primary! text-white! border-primary! hover:bg-violet-700!"
                          : "border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                      }`}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  className="h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
