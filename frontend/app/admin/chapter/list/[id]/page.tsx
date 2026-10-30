"use client";

import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, Plus, X, BookOpen } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  const totalChapters = paginatedData?.pagination.totalChapters ?? chapters.length;
  const totalPages = Math.max(1, paginatedData?.pagination.totalPages ?? 1);

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">
            Chapter: {courseTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{chapters.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalChapters}</span> chapters.
          </p>
        </div>

        <Button
          onClick={handleAddNewChapter}
          className="h-10 rounded-xl bg-primary px-5 text-white shadow-md shadow-violet-200 hover:bg-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chapter
        </Button>
      </div>

      {/* Data Table Card */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <form className="px-5 pt-2" onSubmit={handleSearchSubmit}>
          <InputGroup className="w-full sm:w-96">
            <InputGroupInput
              placeholder="Search chapters..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" type="submit">
                <Search className="h-4 w-4" />
              </Button>
              {(searchInput || searchTerm) && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  type="button"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Chapter Title
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Serial
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Contents
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={5} className="px-4 py-16 text-center text-sm text-gray-500">
                  Loading chapters...
                </TableCell>
              </TableRow>
            ) : chapters.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={5} className="px-4 py-16 text-center text-sm text-gray-500">
                  {searchTerm
                    ? "No chapters match your search."
                    : "No chapters found for this course."}
                </TableCell>
              </TableRow>
            ) : (
              chapters.map((chapter, index) => (
                <TableRow
                  key={chapter._id}
                  className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                >
                  <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                    {(resolvedCurrentPage - 1) * CHAPTERS_PER_PAGE + index + 1}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-primary">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {chapter.title}
                        </p>
                        {chapter.description && (
                          <p className="max-w-xs truncate text-xs text-gray-500">
                            {chapter.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="text-sm font-medium text-gray-700">
                      {chapter.serialNumber ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {chapter.contents?.length ?? 0} Lessons
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                        onClick={() => handleEditChapter(chapter._id)}
                        type="button"
                        title="Edit chapter"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <ConfirmActionDialog
                        title="Delete Chapter"
                        description={`This will permanently delete ${chapter.title}.`}
                        confirmLabel="Delete"
                        loading={isDeletingChapter}
                        loadingLabel="Deleting..."
                        onConfirm={() => handleDeleteChapter(chapter._id)}
                        trigger={
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete chapter"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{chapters.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalChapters}</span> chapters.
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${
                    resolvedCurrentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
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
                          ? "border-primary! bg-primary! text-white! hover:bg-violet-700!"
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
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${
                    resolvedCurrentPage === totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
