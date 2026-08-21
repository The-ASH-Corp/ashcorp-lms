"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ban, Plus, Trash2, Users } from "lucide-react";
import { PropagateLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getAllStudents } from "@/lib/redux/features/student/studentSlice";
import {
  type Student,
  useBlockStudentMutation,
  useDeleteStudentMutation,
  useGetAllStudentsQuery,
} from "@/lib/redux/features/student/studentApi";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const statusStyles: Record<string, { dot: string; bg: string; text: string }> =
  {
    Active: {
      dot: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    Inactive: {
      dot: "bg-gray-400",
      bg: "bg-gray-100",
      text: "text-gray-600",
    },
    Unknown: {
      dot: "bg-slate-400",
      bg: "bg-slate-100",
      text: "text-slate-600",
    },
  };

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length === 0
    ? "S"
    : parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
};

const getStudentStatus = (student: Student) =>
  student.status || (student.role === "user" ? "Active" : "Unknown");

export default function CertificatePage() {
  const router = useRouter();
  const [currentPage] = useState(1);

  const dispatch = useAppDispatch();
  const { data: students, isLoading, isError } = useGetAllStudentsQuery();
  const studentList = students ?? [];

  useEffect(() => {
    if (students) {
      dispatch(getAllStudents(students));
    }
  }, [students, dispatch]);

  const handleUploadPageChange = (studentId: string) => {
    router.push(`/admin/certificate/list/${studentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={15} />
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificate Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">
              {studentList.length}
            </span>{" "}
            students currently loaded.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Phone
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentList.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-gray-500"
                >
                  No students found yet.
                </TableCell>
              </TableRow>
            ) : (
              studentList.map((student, index) => {
                const status = getStudentStatus(student);
                const style = statusStyles[status] ?? statusStyles.Unknown;

                return (
                  <TableRow
                    key={student._id}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    <TableCell className="text-center font-semibold text-gray-900">
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                          {getInitials(student.name)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="text-sm font-medium text-gray-700">
                        {student.email}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="text-sm font-medium text-gray-700">
                        {student.phone}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />
                        {status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {Object.entries(student?.courseProgress || {}).some(
                          ([courseId, progress]) =>
                            Number(progress) >= 100 &&
                            student?.examAttempts?.some(
                              (attempt) =>
                                attempt.courseId === courseId &&
                                attempt.isPassed,
                            ),
                        ) ? (
                          <Button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-violet-700"
                          onClick={()=>handleUploadPageChange(student._id)}>
                            Upload Certificate
                          </Button>
                        ) : (
                          <Label className="text-gray-500">No course is completed</Label>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

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
  );
}
