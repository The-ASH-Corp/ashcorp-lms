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
import { Pencil, Plus, Search, Check, X, Trash } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const listingRef = useRef<HTMLDivElement | null>(null);

  const { data: categoryPage, isLoading, isError } = useGetPaginatedCategoriesQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });
  const categories = categoryPage?.data ?? [];
  const totalPages = categoryPage?.pagination.totalPages ?? 1;
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
      .replace(/\\/g, "/") // <-- replace \ with /
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
              Category Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button className="rounded-xl bg-primary text-white shadow-md shadow-violet-200 hover:bg-violet-700 h-10 px-5">
              <Link
                href="/admin/category/addCategory"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </Button>
          </div>
        </div>

        {/* ─── Data Table ─── */}
        <Card className="border-0 shadow-sm bg-white overflow-hidden" ref={listingRef}>
          <form className="w-sm ml-4" onSubmit={handleSearchSubmit}>
            <InputGroup>
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
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100 ">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  #
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                  Thumbnail
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Title
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center ">
                  Featured
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
              {categories?.map((category: Category, index: number) => {
                const style = statusStyles[category.status];

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
                          src={getCategoryImageUrl(category.iconUrl)}
                          alt={category.categoryName || "Category image"}
                          className="h-24 w-24 rounded-md object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 min-w-30 justify-center">
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {category.categoryName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Featured */}
                    <TableCell className="text-center align-middle">
                      <div
                        className={
                          category.isFeatured
                            ? "bg-green-300 w-20 h-10 rounded-xl flex justify-center items-center "
                            : ""
                        }
                      >
                        {category.isFeatured ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-amber-600" />
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
                        {category.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/category/edit/${category._id}`}>
                          <Button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-500/10 hover:text-primary"
                            size="sm"
                            variant="ghost"
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <ConfirmActionDialog
                          title="Delete Category"
                          description={`This will permanently delete ${category.categoryName}.`}
                          confirmLabel="Delete"
                          loading={isDeletingCategory}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDelete(category._id)}
                          trigger={
                            <Button
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              size="sm"
                              variant="ghost"
                              type="button"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
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
                            ? "bg-primary text-white border-primary hover:bg-violet-700"
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
                    className="h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
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
    </>
  );
}
