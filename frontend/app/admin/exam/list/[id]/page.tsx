"use client";

import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import {
  useDeleteExamMutation,
  useGetExamByCourseQuery,
  type Exam,
} from "@/lib/redux/features/exam/examApi";
import type { Course } from "@/lib/redux/features/course/courseSlice";

const EXAMS_PER_PAGE = 10;

export default function ExamListPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const searchParams = useSearchParams();
  const courseId = params?.id;
  const courseTitleFromRoute = searchParams.get("title") ?? "";
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: exams,
    isLoading,
    isError,
  } = useGetExamByCourseQuery(params.id as string);

  const { data: courses } = useGetAllCourseQuery(undefined, {
    skip: Boolean(courseTitleFromRoute),
  });
  const [deleteExam, { isLoading: isDeletingExam }] = useDeleteExamMutation();

  const examList = exams?.data ?? [];

  const filteredExams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return examList;
    return examList.filter((exam) => exam.title?.toLowerCase().includes(query));
  }, [examList, searchQuery]);

  const totalExams = filteredExams.length;
  const totalPages = Math.max(1, Math.ceil(totalExams / EXAMS_PER_PAGE));
  const resolvedPage = Math.min(currentPage, totalPages);
  const paginatedExams = filteredExams.slice(
    (resolvedPage - 1) * EXAMS_PER_PAGE,
    resolvedPage * EXAMS_PER_PAGE,
  );

  const courseTitle = useMemo(() => {
    if (courseTitleFromRoute) {
      return courseTitleFromRoute;
    }

    const resolvedCourse = (courses as Array<Course & { _id?: string }>)?.find(
      (course) => course.id === courseId || course._id === courseId,
    );

    return resolvedCourse?.title ?? courseId ?? "Unknown Course";
  }, [courseId, courseTitleFromRoute, courses]);

  const handleAddNewExam = () => {
    if (!courseId) return;
    router.push(`/admin/exam/createExam`);
  };

  const handleEditExam = (exam: Exam) => {
    if (!exam._id && !exam.id) return;
    router.push(
      `/admin/exam/edit/${exam._id ?? exam.id}?courseId=${encodeURIComponent(courseId ?? "")}`,
    );
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await deleteExam(examId).unwrap();
      toast.success("Exam deleted successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to delete exam";

      toast.error(message);
    }
  };

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
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">
            Exams: {courseTitle}
          </h1>
        </div>

        <Button
          onClick={handleAddNewExam}
          className="h-10 rounded-xl bg-primary px-5 text-white shadow-md shadow-violet-200 hover:bg-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Exam
        </Button>
      </div>

      {/* Data Table Card */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <div className="px-5 pt-2">
          <InputGroup className="w-full sm:w-96">
            <InputGroupInput
              placeholder="Search Exams..."
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
                Exam Title
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Questions
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={4} className="px-4 py-16 text-center text-sm text-gray-500">
                  Loading exams...
                </TableCell>
              </TableRow>
            ) : paginatedExams.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={4} className="px-4 py-16 text-center text-sm text-gray-500">
                  No exams found for this course.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExams.map((exam, index) => (
                <TableRow
                  key={exam._id ?? exam.id ?? index}
                  className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                >
                  <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                    {(resolvedPage - 1) * EXAMS_PER_PAGE + index + 1}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="text-sm font-semibold text-gray-900">
                      {exam.title}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {exam.questions?.length ?? 0} Questions
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditExam(exam)}
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                        title="Edit exam"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <ConfirmActionDialog
                        title="Delete Exam"
                        description={`This will permanently delete ${exam.title}.`}
                        confirmLabel="Delete"
                        loading={isDeletingExam}
                        loadingLabel="Deleting..."
                        onConfirm={() => {
                          if (exam._id) {
                            handleDeleteExam(exam._id);
                          }
                        }}
                        trigger={
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete exam"
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
            Showing <span className="font-semibold text-gray-700">{paginatedExams.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalExams}</span> exams.
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
  );
}
