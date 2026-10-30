"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
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
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PropagateLoader } from "react-spinners";
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} from "@/lib/redux/features/coupon/couponApi";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

const PAGE_SIZE = 10;

const statusStyles: Record<string, { dot: string; bg: string; text: string }> = {
  Active: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  Expired: {
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  Inactive: {
    dot: "bg-gray-400",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};

export default function CouponPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: coupons = [], isLoading, error } = useGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: isDeletingCoupon }] = useDeleteCouponMutation();
  const [toggleCouponStatus] = useToggleCouponStatusMutation();

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());

      const isExpired = new Date(coupon.validUntil) < new Date();
      const currentStatus = isExpired ? "expired" : coupon.isActive ? "active" : "inactive";

      const matchesStatus = filterStatus === "all" || currentStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, filterStatus]);

  const totalCoupons = filteredCoupons.length;
  const totalPages = Math.max(1, Math.ceil(totalCoupons / PAGE_SIZE));
  const resolvedPage = Math.min(currentPage, totalPages);
  const paginatedCoupons = filteredCoupons.slice(
    (resolvedPage - 1) * PAGE_SIZE,
    resolvedPage * PAGE_SIZE,
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id).unwrap();
      toast.success("Coupon deleted successfully");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleToggleStatus = async (id: string, isExpired: boolean) => {
    if (isExpired) {
      toast.error("Cannot toggle status of an expired coupon");
      return;
    }
    try {
      await toggleCouponStatus(id).unwrap();
      toast.success("Coupon status updated successfully");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-medium text-red-500">Failed to load coupons</p>
        <p className="text-sm text-muted-foreground">{getApiErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Coupon Management</h1>
          </div>
        <Button
          onClick={() => router.push("/admin/coupon/createCoupon")}
          className="h-10 rounded-xl bg-primary px-5 text-white shadow-md shadow-violet-200 hover:bg-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Coupons Table */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 px-5 pt-2 md:flex-row">
          <Input
            className="w-full sm:w-96"
            placeholder="Search Coupon Code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="flex w-full items-center gap-3 md:w-auto">
            <span className="shrink-0 text-sm font-medium text-gray-600">Filter Status:</span>
            <NativeSelect
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm md:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </NativeSelect>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Coupon ID
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Code
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Discount
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Validity Period
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
            {paginatedCoupons.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                  No coupons found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCoupons.map((coupon, index) => {
                const isExpired = new Date(coupon.validUntil) < new Date();
                const statusText = isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive";
                const style = statusStyles[statusText] ?? statusStyles.Inactive;
                const shortId = `#${coupon.id.slice(-6).toUpperCase()}`;

                return (
                  <TableRow
                    key={coupon.id}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                      {index + 1 + (resolvedPage - 1) * PAGE_SIZE}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-medium text-gray-700">
                      {shortId}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900 uppercase">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-medium text-gray-700">
                      ₹{coupon.discount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-medium text-gray-700">
                      {new Date(coupon.applicableFrom).toLocaleDateString()} -{" "}
                      {new Date(coupon.validUntil).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(coupon.id, isExpired)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-opacity select-none ${style.bg} ${style.text} ${
                          isExpired ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {statusText}
                      </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/coupon/edit/${coupon.id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                          title="Edit coupon"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <ConfirmActionDialog
                          title="Delete Coupon"
                          description={`This will permanently delete the coupon ${coupon.code}.`}
                          confirmLabel="Delete"
                          loading={isDeletingCoupon}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDelete(coupon.id)}
                          trigger={
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete coupon"
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{paginatedCoupons.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalCoupons}</span> coupons.
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
