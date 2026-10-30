"use client";

import React, { useState, useRef, useMemo } from "react";
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
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import { PropagateLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import {
  useGetMyCoursesQuery,
  useGetStudentByIdQuery,
  type EnrolledCourse,
} from "@/lib/redux/features/student/studentApi";
import { useUploadCertificateMutation } from "@/lib/redux/features/exam/examApi";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

export default function CompletedCourseList() {
  const id = usePathname();
  const studentId = id.split("/")[4];

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: courses = [], isLoading, isError } = useGetMyCoursesQuery(studentId);
  const { data: selectedUser } = useGetStudentByIdQuery(studentId);
  const [uploadCertificate, { isLoading: isUploading }] = useUploadCertificateMutation();

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  const totalCourses = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalCourses / PAGE_SIZE));
  const resolvedPage = Math.min(currentPage, totalPages);
  const paginatedCourses = filteredCourses.slice(
    (resolvedPage - 1) * PAGE_SIZE,
    resolvedPage * PAGE_SIZE,
  );

  const getCategoryImageUrl = (iconUrl: string) => {
    if (!iconUrl) return "";
    if (/^https?:\/\//i.test(iconUrl)) return iconUrl;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
    const path = iconUrl.replace(/^\/+/, "");
    return `${baseUrl}/${path}`;
  };

  const handleCertificateUpload = (courseId: string) => {
    setSelectedCourseId(courseId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourseId) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, PNG, or JPEG files are allowed.");
      e.target.value = "";
      return;
    }

    const toastId = toast.loading("Uploading certificate...");

    try {
      const response = await uploadCertificate({
        studentId,
        courseId: selectedCourseId,
        file,
      }).unwrap();
      toast.success(response?.message || "Certificate uploaded successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Unable to upload the certificate!", { id: toastId });
    } finally {
      e.target.value = "";
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
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="space-y-6">
        {/* ─── Page Header ─── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-950">
              Upload Certificate
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{paginatedCourses.length}</span> of{" "}
              <span className="font-semibold text-gray-700">{totalCourses}</span> courses.
            </p>
          </div>
        </div>

        {/* ─── Data Table ─── */}
        <Card className="overflow-hidden border-0 bg-white shadow-sm">
          <div className="px-5 pt-2">
            <InputGroup className="w-full sm:w-96">
              <InputGroupInput
                placeholder="Search Course..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <InputGroupAddon align="inline-end">
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
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
              {paginatedCourses.length === 0 ? (
                <TableRow className="border-b border-gray-50">
                  <TableCell colSpan={6} className="px-4 py-16 text-center text-sm text-gray-500">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCourses.map((course: EnrolledCourse, index: number) => {
                  const style = statusStyles[course.status] || statusStyles.Active;
                  const courseId = course.id || (course as any)._id;
                  const progress = selectedUser?.courseProgress?.[courseId] ?? course.progress;
                  const isProgressComplete = Number(progress) === 100;
                  const isExamPassed = selectedUser?.examAttempts?.some(
                    (attempt) =>
                      String(attempt.courseId) === String(courseId) && attempt.isPassed === true,
                  );
                  const isCompleted = isProgressComplete && Boolean(isExamPassed);
                  const isCertificateUploaded = selectedUser?.certificates?.some(
                    (cert: any) =>
                      (typeof cert === "string"
                        ? cert === courseId
                        : cert?.courseId === courseId) &&
                      Boolean(typeof cert === "string" ? cert : cert?.link),
                  );

                  return (
                    <TableRow
                      key={courseId || index}
                      className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                    >
                      <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                        {index + 1 + (resolvedPage - 1) * PAGE_SIZE}
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
                          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style?.bg ?? ""} ${style?.text ?? ""}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${style?.dot ?? ""}`}
                          />
                          {course.status}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-center align-middle">
                        <div className="flex items-center justify-center">
                          {isCertificateUploaded ? (
                            <Label className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                              Uploaded
                            </Label>
                          ) : isCompleted ? (
                            <Button
                              disabled={isUploading && selectedCourseId === courseId}
                              className="cursor-pointer rounded-lg border border-primary bg-transparent text-primary hover:bg-primary hover:text-white disabled:opacity-50"
                              onClick={() => handleCertificateUpload(courseId)}
                            >
                              {isUploading && selectedCourseId === courseId
                                ? "Uploading..."
                                : "Upload"}
                            </Button>
                          ) : (
                            <Label className="rounded-lg bg-transparent text-sm font-medium text-gray-500">
                              Not Eligible
                            </Label>
                          )}
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
              Showing <span className="font-semibold text-gray-700">{paginatedCourses.length}</span> of{" "}
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
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${
                      resolvedPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === resolvedPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        className={`h-8 w-8 rounded-lg text-sm ${
                          page === resolvedPage
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
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${
                      resolvedPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </>
  );
}
