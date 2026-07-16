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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import {
  useDeleteCourseMutation,
  useGetAllCourseQuery,
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
  const [currentPage] = useState(1);
  const { data: courses, isLoading, isError } = useGetAllCourseQuery();
  const [deleteCourse, { isLoading: isDeletingCourse }] =
    useDeleteCourseMutation();
  const [makeCourseFreeAndPublished, { isLoading: isPublishingFreeCourse }] =
    useMakeCourseFreeAndPublishedMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to delete course");
    }
  };

  const handleMakeFreeAndPublish = async (id: string) => {
    try {
      await makeCourseFreeAndPublished(id).unwrap();
      toast.success("Course changed to free and published successfully");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to update course");
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
      <div className="space-y-6">
        {/* ─── Page Header ─── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/course/createCourse">
              <Button className="rounded-xl bg-primary text-white shadow-md shadow-violet-200 hover:bg-violet-700 h-10 px-5">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </Link>
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
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-10 text-center ">
                  #
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                  Id
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Free & Publish
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Course
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Price
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Instructor
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
              {courses?.map((course, index) => {
                const style = statusStyles[course?.status];

                return (
                  <TableRow
                    key={index}
                    className="hover:bg-violet-50/30 transition-colors border-b border-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 justify-center">
                        <p className="text-sm font-semibold text-gray-900">
                          {index + 1}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 min-w-[120px] justify-center">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {course.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 justify-center">
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
                              className={`rounded-lg px-3 py-1 text-sm font-semibold transition-colors ${
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

                    {/* Featured */}
                    <TableCell className="flex  justify-center">
                      <div className="flex items-center gap-3 justify-center overflow-clip w-20">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {course.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {course.price}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {course.instructor || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center ">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium justify-center ${style.bg} ${style.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />
                        {course.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="flex justify-center">
                      <div className="flex items-center justify-end gap-1">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-50 hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <ConfirmActionDialog
                          title="Delete Course"
                          description={`This will permanently delete ${course.title}.`}
                          confirmLabel="Delete"
                          loading={isDeletingCourse}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDelete(course.id)}
                          trigger={
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          }
                        />
                      </div>
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
