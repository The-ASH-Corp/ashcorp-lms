"use client";

import React, { useState, useRef } from "react";
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
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import { PropagateLoader } from "react-spinners";
import type { Course } from "@/lib/redux/features/course/courseSlice";
import { usePathname } from "next/navigation";
import { useGetMyCoursesQuery, useGetStudentByIdQuery, type EnrolledCourse } from "@/lib/redux/features/student/studentApi";
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
  const id = usePathname()
  const studentId = id.split("/")[4];
  
  const [currentPage] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: courses, isLoading, isError } = useGetMyCoursesQuery(studentId);
  const { data: selectedUser } = useGetStudentByIdQuery(studentId);
  const [uploadCertificate, { isLoading: isUploading }] = useUploadCertificateMutation();

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
      <div className="flex justify-center items-center min-h-[80vh]">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
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
            <h1 className="text-2xl font-bold text-gray-900">
              Upload Certificate
            </h1>
          </div>
        </div>

        {/* ─── Data Table ─── */}
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <InputGroup className="w-sm ml-4">
            <InputGroupInput placeholder="Search Category..." />
            <InputGroupAddon align="inline-end">
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100 ">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                  Thumbnail
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Course Name
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.map((course: EnrolledCourse, index: number) => {
                const style = statusStyles[course.status] || statusStyles.Active;
                const courseId = course.id || (course as any)._id;
                const progress = selectedUser?.courseProgress?.[courseId] ?? course.progress;
                const isProgressComplete = Number(progress) === 100;
                const isExamPassed = selectedUser?.examAttempts?.some(
                  (attempt) => String(attempt.courseId) === String(courseId) && attempt.isPassed === true
                );
                const isCompleted = isProgressComplete && Boolean(isExamPassed);
                const isCertificateUploaded = selectedUser?.certificates?.some(
                  (cert: any) =>
                    (typeof cert === "string" ? cert === courseId : cert?.courseId === courseId) &&
                    Boolean(typeof cert === "string" ? cert : cert?.link)
                );

                return (
                  <TableRow
                    key={courseId || index}
                    className="hover:bg-violet-50/30 transition-colors border-b border-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 justify-center ">
                        <Image
                          width={100}
                          height={100}
                          src={getCategoryImageUrl(course.imageUrl)}
                          alt={course.title || "Course image"}
                          className="h-24 w-24 rounded-md object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 min-w-[120px] justify-center">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {course.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* Featured */}
                    <TableCell className="flex text-center justify-center">
                      {course.category || "N/A"}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center ">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium justify-center ${style?.bg ?? ''} ${style?.text ?? ''}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style?.dot ?? ''} animate-pulse`}
                        />
                        {course.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="flex justify-center">
                      {isCertificateUploaded ? (
                        <Label className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold text-xs border border-emerald-200">
                          Uploaded
                        </Label>
                      ) : isCompleted ? (
                        <Button
                          disabled={isUploading && selectedCourseId === courseId}
                          className="bg-transparent text-primary border border-primary rounded-lg hover:bg-primary hover:text-white cursor-pointer disabled:opacity-50"
                          onClick={() => handleCertificateUpload(courseId)}
                        >
                          {isUploading && selectedCourseId === courseId ? "Uploading..." : "Upload"}
                        </Button>
                      ) : (
                        <Label className="bg-transparent text-primary rounded-lg ">
                          Not Eligible
                        </Label>
                      )}
                    </TableCell>
                  </TableRow> 
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
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
        </Card>
      </div>
    </>
  );
}
