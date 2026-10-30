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
import { Pencil, Plus, Search, Check, X, Trash2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import Link from "next/link";
import {
  useDeleteCategoryMutation,
  useGetPaginatedCategoriesQuery,
  type Category,
} from "@/lib/redux/features/category/categoryApi";
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

export default function CategoryPage() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const listingRef = useRef<HTMLDivElement | null>(null);

  const { data: categoryPage, isLoading, isError } = useGetPaginatedCategoriesQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: searchTerm,
  });
  const categories = categoryPage?.data ?? [];
  const totalCategories = categoryPage?.pagination?.totalCategories ?? categories.length;
  const totalPages = Math.max(1, categoryPage?.pagination?.totalPages ?? 1);
  const resolvedCurrentPage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages],
  );
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteCategoryMutation();

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

  const getCategoryImageUrl = (iconUrl: string | undefined) => {
    if (!iconUrl) return "";

    if (/^https?:\/\//i.test(iconUrl)) return iconUrl;

    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";

    const path = iconUrl
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    return `${baseUrl}/${path}`;
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
      toast.success("Category deleted successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to delete category";
      toast.error(message);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch();
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
            Category Management
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-10 rounded-xl bg-primary px-5 text-white shadow-md shadow-violet-200 hover:bg-violet-700">
            <Link
              href="/admin/category/addCategory"
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm" ref={listingRef}>
        <form className="px-5 pt-2" onSubmit={handleSearchSubmit}>
          <InputGroup className="w-full sm:w-96">
            <InputGroupInput
              placeholder="Search Category..."
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
                Thumbnail
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Title
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Featured
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
            {categories.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="px-4 py-16 text-center text-sm text-gray-500">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: Category, index: number) => {
                const style = statusStyles[category.status] ?? statusStyles.Inactive;

                return (
                  <TableRow
                    key={category._id || index}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                      {index + 1 + (resolvedCurrentPage - 1) * PAGE_SIZE}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <Image
                          width={56}
                          height={56}
                          src={getCategoryImageUrl(category.iconUrl)}
                          alt={category.categoryName || "Category image"}
                          className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-semibold text-gray-900">
                        {category.categoryName}
                      </span>
                    </TableCell>

                    {/* Featured */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <div
                          className={
                            category.isFeatured
                              ? "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50"
                              : "flex h-8 w-8 items-center justify-center rounded-lg bg-red-50"
                          }
                        >
                          {category.isFeatured ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style?.bg} ${style?.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style?.dot}`}
                        />
                        {category.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/category/edit/${category._id}`}>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                            type="button"
                            title="Edit category"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <ConfirmActionDialog
                          title="Delete Category"
                          description={`This will permanently delete ${category.categoryName}.`}
                          confirmLabel="Delete"
                          loading={isDeletingCategory}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDelete(category._id)}
                          trigger={
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              type="button"
                              title="Delete category"
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
            Showing <span className="font-semibold text-gray-700">{categories.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalCategories}</span> categories.
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
