"use client";

import React, { useEffect, useState } from "react";
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
import { Ban, Plus, Search, Check, X, Trash, Pencil } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import Link from "next/link";
import { PropagateLoader } from "react-spinners";
import {
  useBlockInstructorMutation,
  useDeleteInstructorMutation,
  useGetAllInstructorsQuery,
} from "@/lib/redux/features/instructor/instructorApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getAllInstructors } from "@/lib/redux/features/instructor/instructorSlice";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
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

export default function InstructorsPage() {

    const [currentPage] = useState(1);
    const router = useRouter();
    
      const { data: instructors, isLoading, isError } = useGetAllInstructorsQuery();
      const dispatch = useAppDispatch();
      const [deleteInstructor, { isLoading: isDeletingInstructor }] =
        useDeleteInstructorMutation();
      const [blockInstructor, { isLoading: isBlockingInstructor }] =
        useBlockInstructorMutation();

      useEffect(() => {
        if (instructors) {
          dispatch(getAllInstructors(instructors));
        }
      }, [instructors, dispatch]);

      const handleDeleteInstructor = async (id: string) => {
        try {
          await deleteInstructor(id).unwrap();
          toast.success("Instructor deleted successfully");
        } catch (error: unknown) {
          const message =
            typeof error === "object" && error !== null && "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message === "string"
              ? (error as { data?: { message?: string } }).data?.message
              : "Failed to delete instructor";

          toast.error(message);
        }
      };

      const handleEditInstructor = (id: string) => {
        router.push(`/admin/instructors/edit/${id}`);
      };

      const handleBlockInstructor = async (id: string) => {
        try {
          const instructor = await blockInstructor(id).unwrap();
          toast.success(
            instructor.status === "Inactive"
              ? "Instructor blocked successfully"
              : "Instructor unblocked successfully",
          );
        } catch (error: unknown) {
          const message =
            typeof error === "object" && error !== null && "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message === "string"
              ? (error as { data?: { message?: string } }).data?.message
              : "Failed to update instructor status";

          toast.error(message);
        }
      };

      const getInstructorImageUrl = (iconUrl: string) => {
        if (!iconUrl) return "";
        if (/^https?:\/\//i.test(iconUrl)) return iconUrl;
        const baseUrl =
          process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
        const path = iconUrl.replace(/^\/+/, "");
        return `${baseUrl}/${path}`;
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
              Instructors Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button className="rounded-xl bg-primary text-white shadow-md shadow-violet-200 hover:bg-violet-700 h-10 px-5">
              <Link
                href="/admin/instructors/createInstructor"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Instructor
              </Link>
            </Button>
          </div>
        </div>

        {/* ─── Data Table ─── */}
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <InputGroup className="w-sm ml-4">
            <InputGroupInput placeholder="Search Instructor..." />
            <InputGroupAddon align="inline-end">
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100 ">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  #
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                  Image
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Email
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Title
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  IsFeatured
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
              {instructors?.map((instructor: { _id: string; status: string; profileImage: string; name: string; email: string; instructorTitle: string; isFeatured: boolean }, index: number) => {
                const style = statusStyles[instructor.status];

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
                      <div className="flex items-center gap-3 justify-center ">
                        <Image
                          width={100}
                          height={100}
                          src={getInstructorImageUrl(instructor.profileImage)}
                          alt={instructor.name || "Instructor image"}
                          className="h-24 w-24 rounded-md object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 min-w-30 justify-center">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {instructor.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                        <div className="flex items-center gap-3 min-w-30 justify-center">
                            <span className="text-sm font-semibold text-gray-900 w-10">
                                {instructor.email}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3 min-w-30 justify-center">
                            <span className="text-sm font-semibold text-gray-900 w-10">
                                {instructor.instructorTitle}
                            </span>
                        </div>
                    </TableCell>
                    {/* Featured */}
                    <TableCell className="text-center align-middle">
                      <div
                        className={
                          instructor.isFeatured
                            ? "bg-green-300 w-20 h-10 rounded-xl flex justify-center items-center "
                            : "bg-red-300 w-20 h-10 rounded-xl flex justify-center items-center"
                        }
                      >
                        {instructor.isFeatured ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium justify-center ${style.bg} ${style.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot} animate-pulse`}
                        />
                        {instructor.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditInstructor(instructor._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-violet-600"
                          title="Edit instructor"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBlockInstructor(instructor._id)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            instructor.status === "Inactive"
                              ? "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                              : "text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                          }`}
                          title={
                            instructor.status === "Inactive"
                              ? "Unblock instructor"
                              : "Block instructor"
                          }
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <ConfirmActionDialog
                          title="Delete Instructor"
                          description={`This will permanently delete ${instructor.name}.`}
                          confirmLabel="Delete"
                          loading={isDeletingInstructor || isBlockingInstructor}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDeleteInstructor(instructor._id)}
                          trigger={
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete instructor"
                            >
                              <Trash className="h-4 w-4" />
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
