"use client"
import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  CalendarDays,
  Hash,
  Ticket,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function CouponField({
  icon: Icon,
  label,
  placeholder,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-4 py-3 text-sm text-muted-foreground">
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span>{placeholder}</span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
        <span className="inline-flex h-[22px] w-[22px] items-center justify-center text-primary">
          <Icon className="h-[22px] w-[22px]" />
        </span>
      </div>
      <div>
        <p className="mb-1 text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function CreateCouponPage() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="w-full bg-background p-4 text-foreground sm:p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Create New Coupon
          </h1>
          <p className="text-base text-muted-foreground">
            Issue promotional discounts for the Ash Academy elite course
            library.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-6 lg:flex-row">
            <CouponField
              icon={Hash}
              label="Coupon Code"
              placeholder="Enter coupon code"
            />
            <CouponField
              icon={Wallet}
              label="Discount (In Amount)"
              placeholder="Enter discount amount"
            />
          </div>

          <div className="mb-8 flex flex-col gap-6 lg:flex-row">
            <CouponField
              icon={CalendarDays}
              label="Applicable From"
              placeholder="mm/dd/yyyy"
            />
            <CouponField
              icon={CalendarDays}
              label="Valid Until"
              placeholder="mm/dd/yyyy"
            />
          </div>

          <div className="mb-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={isActive ? "Deactivate coupon" : "Activate coupon"}
              onClick={() => setIsActive((current) => !current)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-200 ${
                isActive ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full bg-white transition-transform duration-200 ${
                  isActive ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-foreground">Is Active</span>
            {isActive && (
              <span className="rounded bg-primary/50 px-2 py-0.5 text-xs font-medium tracking-wide text-primary-foreground">
                LIVE STATUS
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-lg bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
            >
              Create Coupon
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
