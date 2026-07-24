"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} from "@/lib/redux/features/coupon/couponApi";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

export default function CouponPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: coupons = [], isLoading, error } = useGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: isDeletingCoupon }] = useDeleteCouponMutation();
  const [toggleCouponStatus] = useToggleCouponStatusMutation();

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isExpired = new Date(coupon.validUntil) < new Date();
      const currentStatus = isExpired ? "expired" : (coupon.isActive ? "active" : "inactive");
      
      const matchesStatus = filterStatus === "all" || currentStatus === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, filterStatus]);

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
      <div className="flex h-96 items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center bg-background">
        <p className="text-red-500 font-medium">Failed to load coupons</p>
        <p className="text-sm text-muted-foreground">{getApiErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
        </div>
        <Button
          onClick={() => router.push("/admin/coupon/createCoupon")}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Coupons Table */}
      <Card className="border-border">
        <CardHeader className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            className="md:w-[40%]"
            placeholder="Search Coupon Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600 shrink-0">Filter Status:</span>
            <NativeSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-gray-50 h-10 px-3 text-sm w-full md:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </NativeSelect>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-border">
              <TableRow>
                <TableHead className="pl-6 font-semibold text-gray-700 uppercase text-xs w-[120px]">Coupon ID</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Code</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Discount</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Validity Period</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = new Date(coupon.validUntil) < new Date();
                  const statusText = isExpired ? "Expired" : (coupon.isActive ? "Active" : "Inactive");
                  const shortId = `#${coupon.id.slice(-6).toUpperCase()}`;
                  
                  return (
                    <TableRow key={coupon.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <TableCell className="pl-6 text-sm font-medium text-gray-900">{shortId}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-900 uppercase">{coupon.code}</TableCell>
                      <TableCell className="text-sm font-medium text-violet-600">₹{coupon.discount}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(coupon.applicableFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          onClick={() => handleToggleStatus(coupon.id, isExpired)}
                          className={`text-xs px-3 py-1 border rounded-full cursor-pointer hover:opacity-80 transition-opacity select-none ${
                            statusText === "Active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : statusText === "Expired"
                              ? "bg-red-50 text-red-700 border-red-200 cursor-not-allowed"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {statusText}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/coupon/edit/${coupon.id}`)}
                            className="hover:bg-gray-100 text-gray-600 hover:text-primary"
                            title="Edit coupon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <ConfirmActionDialog
                            title="Delete Coupon"
                            description={`This will permanently delete the coupon ${coupon.code}.`}
                            confirmLabel="Delete"
                            loading={isDeletingCoupon}
                            loadingLabel="Deleting..."
                            onConfirm={() => handleDelete(coupon.id)}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-gray-100 text-red-600 hover:text-red-800"
                                title="Delete coupon"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
