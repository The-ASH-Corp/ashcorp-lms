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
import { Plus, GraduationCap, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropagateLoader } from "react-spinners";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import {
  useDeleteGraduateMutation,
  useGetPaginatedGraduatesQuery,
  useToggleGraduateFeatureMutation,
} from "@/lib/redux/features/graduate/graduateApi";

export default function GraduatesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchQuery] = useState("");

  const { data: response, isLoading, isError } = useGetPaginatedGraduatesQuery({
    page: currentPage,
    limit,
    search: searchQuery,
  });
  const graduates = response?.data?.graduates || [];
  const totalGraduates = response?.data?.totalGraduates ?? graduates.length;
  const totalPages = Math.max(1, Math.ceil(totalGraduates / limit));

  const [deleteGraduate, { isLoading: isDeleting }] = useDeleteGraduateMutation();
  const [toggleFeature, { isLoading: isToggling }] = useToggleGraduateFeatureMutation();

  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (/^(https?:\/\/|data:image)/i.test(url)) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
    const path = url.replace(/^\/+/, "");
    return `${baseUrl}/${path}`;
  };

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      await toggleFeature(id).unwrap();
      toast.success(
        !currentStatus
          ? "Graduate featured on landing page"
          : "Graduate unfeatured from landing page",
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update feature status");
    }
  };

  const handleDeleteGraduate = async (id: string, name: string) => {
    try {
      await deleteGraduate(id).unwrap();
      toast.success(`Successfully deleted ${name}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete graduate");
    }
  };

  const filteredGraduates = graduates;

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
          Failed to load graduates list
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-indigo-950">
            <GraduationCap className="h-7 w-7 text-primary" />
            Graduates Management
          </h1>
         
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-10 rounded-xl bg-primary px-5 text-white shadow-md shadow-violet-200 hover:bg-violet-700">
            <Link
              href="/admin/graduates/createGraduate"
              className="flex items-center text-sm font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Graduate
            </Link>
          </Button>
        </div>
      </div>

      {/* Data Table Card */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Graduate Photo
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Featured On Landing Page
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGraduates && filteredGraduates.length > 0 ? (
              filteredGraduates.map((graduate, index) => {
                const id = graduate.id || graduate._id || String(index);

                return (
                  <TableRow
                    key={id}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    {/* Index */}
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                      {index + 1 + (currentPage - 1) * limit}
                    </TableCell>

                    {/* Image */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                          {graduate.image ? (
                            <Image
                              src={getImageUrl(graduate.image)}
                              alt="Graduate"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Featured Toggle Switch */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          {graduate.featureOnLandingPage ? "Featured" : "Hidden"}
                        </span>
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() =>
                            handleToggleFeature(
                              id,
                              graduate.featureOnLandingPage ?? false,
                            )
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-hidden ${
                            graduate.featureOnLandingPage
                              ? "bg-emerald-500"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          title={
                            graduate.featureOnLandingPage
                              ? "Click to unfeature"
                              : "Click to feature on landing page"
                          }
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                              graduate.featureOnLandingPage
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/graduates/editGraduate/${id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                          title="Edit Graduate"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <ConfirmActionDialog
                          title="Delete Graduate Spotlight"
                          description={`Are you sure you want to delete this graduate? This action cannot be undone.`}
                          confirmLabel="Delete"
                          loading={isDeleting}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDeleteGraduate(id, "this graduate")}
                          trigger={
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete Graduate"
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
            ) : (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={4} className="px-4 py-16 text-center text-sm text-gray-500">
                  No graduates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredGraduates.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalGraduates}</span> graduates.
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
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                      isActive={currentPage === page}
                      className={`h-8 w-8 rounded-lg text-sm ${
                        currentPage === page
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
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 p-0 hover:border-violet-300 hover:bg-violet-50 ${
                    currentPage === totalPages ? "pointer-events-none opacity-50" : ""
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
