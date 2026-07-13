"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  RefreshCcw,
} from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

// Mock data
const initialCoupons = [
  {
    id: "#001",
    code: "SUMMERSALE24",
    type: "Percentage",
    discount: "20%",
    minAmount: "₹1000",
    maxAmount: "₹5000",
    usage: "150/200",
    status: "Active",
    expiry: "2024-08-31",
    usageLimit: 200,
  },
  {
    id: "#002",
    code: "WELCOME10",
    type: "Fixed Amount",
    discount: "₹200",
    minAmount: "₹1000",
    maxAmount: "No Limit",
    usage: "85/100",
    status: "Active",
    expiry: "2024-09-30",
    usageLimit: 100,
  },
  {
    id: "#003",
    code: "FESTIVE50",
    type: "Percentage",
    discount: "50%",
    minAmount: "₹2000",
    maxAmount: "₹10000",
    usage: "45/50",
    status: "Active",
    expiry: "2024-12-31",
    usageLimit: 50,
  },
  {
    id: "#004",
    code: "EXPIRED23",
    type: "Fixed Amount",
    discount: "₹500",
    minAmount: "₹1500",
    maxAmount: "No Limit",
    usage: "250/250",
    status: "Expired",
    expiry: "2023-12-31",
    usageLimit: 250,
  },
];

export default function CouponPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [openCouponModal, setOpenCouponModal] = useState(false);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || coupon.status.toLowerCase() === filterStatus;
      const matchesType = filterType === "all" || coupon.type.toLowerCase() === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchTerm, filterStatus, filterType]);

  const handleAction = (action: string, coupon: any) => {
    switch (action) {
      case "view":
        console.log("View coupon:", coupon);
        break;
      case "edit":
        console.log("Edit coupon:", coupon);
        setOpenCouponModal(true);
        break;
      case "delete":
        console.log("Delete coupon:", coupon);
        break;
      default:
        break;
    }
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons((prevCoupons) =>
      prevCoupons.map((coupon) =>
        coupon.id === couponId
          ? { ...coupon, status: coupon.status === "Active" ? "Inactive" : "Active" }
          : coupon
      )
    );
  };

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
        <CardHeader className="p-6">
          <Input className="md:w-[50%]" placeholder="Search Coupon"  />
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-border">
              <TableRow>
                <TableHead className="pl-6 font-semibold text-gray-700 uppercase text-xs w-[100px]">Coupon ID</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Code</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Type</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Discount</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Min. Purchase</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Usage</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs">Expiry Date</TableHead>
                <TableHead className="font-semibold text-gray-700 uppercase text-xs text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                    <TableCell className="pl-6 text-sm font-medium text-gray-900">{coupon.id}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-900 uppercase">{coupon.code}</TableCell>
                    <TableCell className="text-sm text-gray-600">{coupon.type}</TableCell>
                    <TableCell className="text-sm font-medium text-violet-600">{coupon.discount}</TableCell>
                    <TableCell className="text-sm text-gray-600">{coupon.minAmount}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-2">{coupon.usage}</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${coupon.status === "Active" ? "bg-primary" : "bg-gray-400"}`}
                            style={{ width: `${Math.min((parseInt(coupon.usage.split('/')[0]) / coupon.usageLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs px-3 py-1 border rounded-full ${coupon.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                          }`}
                      >
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{coupon.expiry}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction("view", coupon)}
                          className="hover:bg-gray-100 text-gray-600 hover:text-primary"
                          title="View coupon details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction("edit", coupon)}
                          className="hover:bg-gray-100 text-gray-600 hover:text-primary"
                          title="Edit coupon"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction("delete", coupon)}
                          className="hover:bg-gray-100 text-gray-600 hover:text-primary"
                          title="Delete coupon"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Coupon Modal */}
      {openCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-[600px] bg-white rounded-xl shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {/* TODO: Add actual coupon data */}
                  Create New Coupon
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Fill in the details for the new coupon
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenCouponModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Coupon Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="coupon-code" className="text-gray-700 font-medium">Coupon Code</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                        // TODO: Add actual coupon code data
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Random
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="coupon-code"
                      placeholder="Enter coupon code..."
                      className="pl-4 pr-12 border-gray-300 rounded-lg h-10 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add coupon code value
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        // TODO: Add copy coupon code functionality
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Coupon Type and Discount Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coupon-type" className="text-gray-700 font-medium">Coupon Type</Label>
                    <NativeSelect className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50">
                      <option value="percentage">Percentage</option>
                      <option value="fixed amount">Fixed Amount</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <Label htmlFor="discount-value" className="text-gray-700 font-medium">Discount Value</Label>
                    <div className="relative mt-2">
                      <Input
                        id="discount-value"
                        placeholder="Enter value"
                        className="pl-4 pr-12 border-gray-300 rounded-lg h-10 focus:border-primary focus:ring-1 focus:ring-primary"
                        value=""
                        // TODO: Add discount value
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimum Purchase and Maximum Discount Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-purchase" className="text-gray-700 font-medium">Minimum Purchase (₹)</Label>
                    <Input
                      id="min-purchase"
                      placeholder="Enter minimum purchase amount"
                      className="border-gray-300 rounded-lg h-10 mt-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add minimum purchase amount
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-discount" className="text-gray-700 font-medium">Maximum Discount (₹)</Label>
                    <Input
                      id="max-discount"
                      placeholder="Enter maximum discount amount (optional)"
                      className="border-gray-300 rounded-lg h-10 mt-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add maximum discount amount
                    />
                  </div>
                </div>

                {/* Usage Limits and Duration Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="usage-limit" className="text-gray-700 font-medium">Usage Limit</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      placeholder="Enter total usage limit"
                      className="border-gray-300 rounded-lg h-10 mt-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add usage limit
                    />
                  </div>

                  <div>
                    <Label htmlFor="per-user-limit" className="text-gray-700 font-medium">Per User Limit</Label>
                    <Input
                      id="per-user-limit"
                      type="number"
                      placeholder="Enter per-user usage limit"
                      className="border-gray-300 rounded-lg h-10 mt-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add per-user limit
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-gray-700 font-medium">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      className="border-gray-300 rounded-lg h-10 mt-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add start date
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiry-date" className="text-gray-700 font-medium">Expiry Date</Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      className="border-gray-300 rounded-lg h-10 mt-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      value=""
                      // TODO: Add expiry date
                    />
                  </div>
                </div>

                {/* Auto-Generate Coupon Code Section */}
                <div className="space-y-3">
                  <Label htmlFor="auto-generate" className="text-gray-700 font-medium">Auto-Generate Coupon Code</Label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="auto-generate"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        checked={false}
                        // TODO: Handle auto-generate checkbox
                      />
                      <span className="text-sm text-gray-600">Automatically generate coupon code</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={false}
                      // TODO: Handle auto-generate button
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Auto-Generate
                    </Button>
                  </div>
                </div>

                {/* Course Assignment Section */}
                <div className="space-y-3">
                  <Label htmlFor="courses" className="text-gray-700 font-medium">Assign to Course</Label>
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    <span>Select courses...</span>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Coupon Description Section */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-gray-700 font-medium">Coupon Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a brief description for this coupon..."
                    className="border-gray-300 rounded-lg min-h-[80px] focus:border-primary focus:ring-1 focus:ring-primary"
                    value=""
                    onChange={(e) => {
                        // TODO: Handle description
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                className="border-gray-300 rounded-lg h-10 px-6 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setOpenCouponModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white rounded-lg h-10 px-6"
                onClick={() => {
                  // TODO: Handle coupon submission
                }}
              >
                Save Coupon
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
