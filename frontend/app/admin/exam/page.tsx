"use client";

import React, { useState } from "react";
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
} from "@/components/ui/pagination";
import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import { PropagateLoader } from "react-spinners";
import { useGetPaginatedCoursesQuery } from "@/lib/redux/features/course/courseApi";
import type { Course } from "@/lib/redux/features/course/courseSlice";
import { useRouter } from "next/navigation";

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

export default function Exampage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const router = useRouter();

  const { data: response, isLoading, isError } = useGetPaginatedCoursesQuery({
    page: currentPage,
    limit,
    search: searchTerm,
  });

  const courses = response?.data || [];
  const totalCourses = response?.pagination?.totalCourses ?? courses.length;
  const totalPages = Math.max(1, Math.ceil(totalCourses / limit));

  const applySearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getCategoryImageUrl = (iconUrl: string) => {
    if (!iconUrl) return "";
    if (/^https?:\/\//i.test(iconUrl)) return iconUrl;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
    const path = iconUrl.replace(/^\/+/, "");
    return `${baseUrl}/${path}`;
  };

  const handleViewExams = (courseId: string, courseTitle: string) => {
    router.push(
      `/admin/exam/list/${courseId}?title=${encodeURIComponent(courseTitle)}`,
    );
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
            Exam Management
          </h1>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <form className="px-5 pt-2" onSubmit={applySearch}>
          <InputGroup className="w-full sm:w-96">
            <InputGroupInput
              placeholder="Search Course..."
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
                Thumbnail
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Course Name
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
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
                <TableCell colSpan={6} className="px-4 py-16 text-center text-sm text-gray-500">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course: Course, index: number) => {
                const style = statusStyles[course.status] ?? statusStyles.Inactive;

                return (
                  <TableRow
                    key={course.id || index}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                      {index + 1 + (currentPage - 1) * limit}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <Image
                          width={80}
                          height={56}
                          src={getCategoryImageUrl(course.imageUrl)}
                          alt={course.title || "Course image"}
                          className="h-14 w-20 rounded-lg border border-gray-100 bg-gray-50 object-contain"
                          unoptimized
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-semibold text-gray-900">
                        {course.title}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">
                        {course.category || "N/A"}
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
                      <div className="flex items-center justify-center">
                        <Button
                          className="cursor-pointer rounded-lg border border-primary bg-transparent text-primary hover:bg-primary hover:text-white"
                          onClick={() => handleViewExams(course.id, course.title)}
                        >
                          View Exams
                        </Button>
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={page === currentPage}
                      className={`h-8 w-8 rounded-lg text-sm ${page === currentPage
                          ? "border-primary! bg-primary! text-white! hover:bg-violet-700!"
                          : "border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                        }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
