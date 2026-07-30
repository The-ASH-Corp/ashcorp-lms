"use client";

import type {
  ChangeEventHandler,
  ComponentType,
  HTMLInputTypeAttribute,
  ReactNode,
  SVGProps,
} from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CalendarDays,
  Hash,
  RefreshCcw,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import {
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} from "@/lib/redux/features/coupon/couponApi";
import { getApiErrorMessage } from "@/lib/utils";

function CouponField({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  action,
  min,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  action?: ReactNode;
  min?: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative min-w-0 flex-1">
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            min={min}
            className="h-12 rounded-lg border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {action}
      </div>
    </div>
  );
}

export default function EditCouponPage() {
  const params = useParams() as { id?: string };
  const couponId = params.id;
  const router = useRouter();

  const {
    data: coupon,
    isLoading,
    error,
  } = useGetCouponByIdQuery(couponId ?? "", {
    skip: !couponId,
  });
  const [updateCoupon, { isLoading: isSaving }] = useUpdateCouponMutation();

  const [isActive, setIsActive] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [applicableFrom, setApplicableFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    if (!coupon) {
      return;
    }

    setCouponCode(coupon.code);
    setDiscount(String(coupon.discount));
    setApplicableFrom(String(coupon.applicableFrom).split("T")[0]);
    setValidUntil(String(coupon.validUntil).split("T")[0]);
    setIsActive(coupon.isActive);
  }, [coupon]);

  const generateCouponCode = () => {
    const suffixLength = 6 + Math.floor(Math.random() * 3);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const alphanumeric = `${letters}${digits}`;

    const chars = Array.from({ length: suffixLength }, (_, index) => {
      if (index === 0) {
        return digits[Math.floor(Math.random() * digits.length)];
      }
      return alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    });

    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    const nextCode = `ASH${chars.join("")}`;
    setCouponCode(nextCode);
  };

  const isExpired = validUntil ? new Date(validUntil) < new Date() : false;
  const couponStatus = isExpired ? "Expired" : isActive ? "Active" : "Inactive";
  const isSwitchOn = !isExpired && isActive;

  const handleSubmit = async () => {
    if (!couponId) {
      toast.error("Coupon id is missing");
      return;
    }

    if (!couponCode.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!discount.trim() || Number(discount) <= 0) {
      toast.error("Discount must be a positive number");
      return;
    }
    if (!applicableFrom) {
      toast.error("Please select a starting date");
      return;
    }
    if (!validUntil) {
      toast.error("Please select an expiry date");
      return;
    }
    if (new Date(applicableFrom) > new Date(validUntil)) {
      toast.error("Applicable From date cannot be after Valid Until date");
      return;
    }

    try {
      await updateCoupon({
        id: couponId,
        code: couponCode,
        discount: Number(discount),
        applicableFrom,
        validUntil,
        isActive: isExpired ? false : isActive,
      }).unwrap();
      toast.success("Coupon updated successfully");
      router.push("/admin/coupon");
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError));
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
        <p className="text-red-500 font-medium">Failed to load coupon</p>
        <p className="text-sm text-muted-foreground">{getApiErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-4 text-foreground sm:p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Edit Coupon
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update the coupon details, dates, and activation state.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              Current Status:
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                couponStatus === "Active"
                  ? "bg-green-50 text-green-700"
                  : couponStatus === "Expired"
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {couponStatus}
            </span>
            {isExpired ? (
              <span className="text-sm text-red-600">
                Expired coupons are saved as inactive until the validity window is extended.
              </span>
            ) : null}
          </div>

          <div className="mb-6 flex flex-col gap-6 lg:flex-row">
            <CouponField
              icon={Hash}
              label="Coupon Code"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCouponCode}
                  className="h-12 w-full shrink-0 rounded-lg border-primary bg-background px-4 text-sm font-medium text-foreground hover:bg-secondary/50 sm:w-auto"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              }
            />
            <CouponField
              icon={Wallet}
              label="Discount (In Amount)"
              placeholder="Enter discount amount"
              type="number"
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
            />
          </div>

          <div className="mb-8 flex flex-col gap-6 lg:flex-row">
            <CouponField
              icon={CalendarDays}
              label="Applicable From"
              placeholder="Select date"
              type="date"
              value={applicableFrom}
              onChange={(event) => {
                const nextDate = event.target.value;
                setApplicableFrom(nextDate);
                if (validUntil && nextDate && validUntil < nextDate) {
                  setValidUntil(nextDate);
                }
              }}
            />
            <CouponField
              icon={CalendarDays}
              label="Valid Until"
              placeholder="Select date"
              type="date"
              value={validUntil}
              onChange={(event) => setValidUntil(event.target.value)}
              min={applicableFrom || undefined}
            />
          </div>

          <div className="mb-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={isSwitchOn}
              aria-label={isExpired ? "Expired coupon" : isActive ? "Deactivate coupon" : "Activate coupon"}
              onClick={() => {
                if (!isExpired) {
                  setIsActive((current) => !current);
                }
              }}
              disabled={isExpired}
              className={`relative inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-200 ${
                isExpired ? "cursor-not-allowed bg-red-300" : isActive ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full bg-white transition-transform duration-200 ${
                  isSwitchOn ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-foreground">Is Active</span>
            {isExpired ? (
              <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-medium tracking-wide text-red-700">
                EXPIRED
              </span>
            ) : isActive ? (
              <span className="rounded bg-primary/50 px-2 py-0.5 text-xs font-medium tracking-wide text-primary-foreground">
                LIVE
              </span>
            ) : (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium tracking-wide text-gray-700">
                OFF
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="rounded-lg bg-primary px-7 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Update Coupon"}
            </button>
            <Link
              href="/admin/coupon"
              className="rounded-lg border border-border bg-background px-7 py-3 text-sm font-medium text-foreground"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
