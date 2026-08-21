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
import { Plus, Search, GraduationCap, Building2, Pencil, Trash2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading, isError } = useGetPaginatedGraduatesQuery({
    page: currentPage,
    limit,
    search: searchQuery,
  });
  const graduates = response?.data?.graduates || [];
  const totalGraduates = response?.data?.totalGraduates || 0;
  const totalPages = Math.ceil(totalGraduates / limit);

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
          : "Graduate unfeatured from landing page"
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="h-7 w-7 text-primary" />
            Graduates Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage placed graduates, feature status, and landing page spotlights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl bg-primary text-white shadow-md shadow-violet-200 hover:bg-violet-700 h-10 px-5">
            <Link
              href="/admin/graduates/createGraduate"
              className="flex items-center text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Graduate
            </Link>
          </Button>
        </div>
      </div>

      {/* Data Table Card */}
      <Card className="border-0 shadow-xs bg-white overflow-hidden rounded-2xl">


        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center w-16">
                #
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Graduate Photo
              </TableHead>

              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Featured On Landing Page
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center w-28">
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
                    className="hover:bg-violet-50/30 transition-colors border-b border-gray-50"
                  >
                    {/* Index */}
                    <TableCell className="text-center align-middle">
                      <span className="text-sm font-semibold text-gray-600">
                        {index + 1}
                      </span>
                    </TableCell>

                    {/* Image */}
                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center">
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs">
                          {graduate.image ? (
                            <Image
                              src={getImageUrl(graduate.image)}
                              alt="Graduate"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>



                    {/* Featured Toggle Switch */}
                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-xs font-semibold text-gray-600">
                          {graduate.featureOnLandingPage ? "Featured" : "Hidden"}
                        </span>
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() =>
                            handleToggleFeature(
                              id,
                              graduate.featureOnLandingPage ?? false
                            )
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-hidden cursor-pointer ${
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
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                              graduate.featureOnLandingPage
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </TableCell>

                    {/* Actions Column (Edit Page Link & Delete Confirmation) */}
                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Link */}
                        <Link
                          href={`/admin/graduates/editGraduate/${id}`}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-violet-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Edit Graduate"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        {/* Delete Button with Confirmation Dialog */}
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
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <GraduationCap className="h-12 w-12 mb-3 stroke-[1.5]" />
                    <p className="text-base font-semibold text-gray-700">
                      No graduates found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery
                        ? "Try clearing your search query"
                        : "Click 'Add Graduate' to create the first graduate entry"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center border-t border-gray-100 px-5 py-4">
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text=""
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={`h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 flex items-center justify-center ${
                      currentPage === 1 ? "opacity-50 pointer-events-none" : ""
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
                            ? "bg-primary! text-white! border-primary!"
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
                    className={`h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 flex items-center justify-center ${
                      currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}