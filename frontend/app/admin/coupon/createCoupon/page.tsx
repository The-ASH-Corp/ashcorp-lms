"use client"

import type {
  ChangeEventHandler,
  ComponentType,
  HTMLInputTypeAttribute,
  ReactNode,
  SVGProps,
} from "react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Hash,
  RefreshCcw,
  Wallet,
} from "lucide-react";

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


export default function CreateCouponPage() {
  const [isActive, setIsActive] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [applicableFrom, setApplicableFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");

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

    const code = `ASH${chars.join("")}`;
    setCouponCode(code);
  };

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
              type="text"
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
                LIVE
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
