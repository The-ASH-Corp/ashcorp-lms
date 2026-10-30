"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import {
  useDeleteCourseMutation,
  useGetPaginatedCoursesQuery,
  useMakeCourseFreeAndPublishedMutation,
} from "@/lib/redux/features/course/courseApi";
import { PropagateLoader } from "react-spinners";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

const statusStyles: Record<string, { dot: string; bg: string; text: string }> =
  {
    Active: {
      dot: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    "On Hold": {
      dot: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
    Inactive: { dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600" },
  };

export default function CoursesPage() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const listingRef = useRef<HTMLDivElement | null>(null);

  const { data: coursePage, isLoading, isError } = useGetPaginatedCoursesQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: searchTerm,
  });
  const courses = coursePage?.data ?? [];
  const totalCourses = coursePage?.pagination?.totalCourses ?? courses.length;
  const totalPages = Math.max(1, coursePage?.pagination?.totalPages ?? 1);
  const resolvedCurrentPage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages],
  );
  const [deleteCourse, { isLoading: isDeletingCourse }] =
    useDeleteCourseMutation();
  const [makeCourseFreeAndPublished, { isLoading: isPublishingFreeCourse }] =
    useMakeCourseFreeAndPublishedMutation();

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

  useEffect(() => {
    listingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [resolvedCurrentPage]);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id).unwrap();
      if (courses.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
      toast.success("Course deleted successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to delete course";
      toast.error(message);
    }
  };

  const handleMakeFreeAndPublish = async (id: string) => {
    try {
      await makeCourseFreeAndPublished(id).unwrap();
      toast.success("Course changed to free and published successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update course";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">
            Course Management
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-10 rounded-xl bg-primary px-5 text-white shadow-md shadow-violet-200 hover:bg-violet-700">
            <Link href="/admin/course/createCourse" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm" ref={listingRef}>
        <form className="px-5 pt-2" onSubmit={handleSearchSubmit}>
          <InputGroup className="w-full sm:w-96">
            <InputGroupInput
              placeholder="Search Course..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
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
                Course Name
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Free & Publish
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Price
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Instructor
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={8} className="px-4 py-16 text-center text-sm text-gray-500">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course, index) => {
                const style = statusStyles[course?.status] ?? statusStyles.Inactive;

                return (
                  <TableRow
                    key={course.id || index}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                      {index + 1 + (resolvedCurrentPage - 1) * PAGE_SIZE}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-semibold text-gray-900">
                        {course.title}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <ConfirmActionDialog
                          title="Make Course Free"
                          description={`This will change ${course.title} to a free published course.`}
                          confirmLabel="Make Free"
                          loading={isPublishingFreeCourse}
                          loadingLabel="Updating..."
                          onConfirm={() => handleMakeFreeAndPublish(course.id)}
                          trigger={
                            <button
                              type="button"
                              disabled={course.isPublished}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                course.isPublished
                                  ? "cursor-not-allowed bg-emerald-50 text-emerald-700"
                                  : "bg-violet-50 text-primary hover:bg-violet-100"
                              }`}
                            >
                              {course.isPublished ? "Free" : "Paid"}
                            </button>
                          }
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">
                        {course.category || "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">
                        {course.price}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">
                        {course.instructor || "N/A"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />
                        {course.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/course/edit/${course.id}`}>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                            title="Edit course"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <ConfirmActionDialog
                          title="Delete Course"
                          description={`This will permanently delete ${course.title}.`}
                          confirmLabel="Delete"
                          loading={isDeletingCourse}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDelete(course.id)}
                          trigger={
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{courses.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalCourses}</span> courses.
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
                      className={`h-8 w-8 rounded-lg text-sm ${
                        item === resolvedCurrentPage
                          ? "border-primary! bg-primary! text-white! hover:bg-violet-700!"
                          : "border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                      }`}
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage(item);
                      }}
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
