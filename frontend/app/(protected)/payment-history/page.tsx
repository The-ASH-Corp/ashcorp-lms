"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/payment-history/Data-table";
import { useGetCurrentUserQuery } from "@/lib/redux/features/auth/authApi";
import { useGetMyCoursesQuery } from "@/lib/redux/features/student/studentApi";
import type { PurchasedCourse } from "@/lib/redux/features/auth/authSlice";
import { PropagateLoader } from "react-spinners";
import { ColumnDef } from "@tanstack/react-table";

interface Payment {
  date: string;
  invoice: string;
  product: string;
  type: string;
  amount: string;
  status: string;
  actions: string;
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
 
]

const formatDate = (value?: string) => {
  if (!value) {
    return "N/A";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatPaymentMethod = (method?: string) => {
  if (!method) return "N/A";
  if (method.toLowerCase() === "free") return "FREE";

  return method
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function PaymentHistory() {
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUserQuery();
  const { data: myCourses = [], isLoading: isCoursesLoading } = useGetMyCoursesQuery();

  const rows = useMemo<Payment[]>(() => {
    const courseNameById = new Map(
      myCourses.map((course) => [String(course.id), course.title]),
    );

    const purchases = [...(user?.purchasedCourses ?? [])] as PurchasedCourse[];

    purchases.sort((first, second) => {
      const firstTime = new Date(first.paymentTime).getTime();
      const secondTime = new Date(second.paymentTime).getTime();
      return secondTime - firstTime;
    });

    return purchases.map((purchase) => {
      const courseTitle =
        courseNameById.get(String(purchase.courseId)) ?? "Course";
      const invoiceId = purchase.paymentId || "N/A";
      const amount = Number(purchase.amount ?? 0);

      return {
        date: formatDate(purchase.paymentTime),
        invoice: invoiceId,
        product: courseTitle,
        type: formatPaymentMethod(purchase.methodOfPayment),
        amount: formatAmount(amount),
        status: amount > 0 ? "Paid" : "Enrolled",
        actions: "-",
      };
    });
  }, [myCourses, user?.purchasedCourses]);

  if (isUserLoading || isCoursesLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={12} />
      </div>
    );
  }

  if (isUserError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-medium text-red-500">Unable to load payment history.</p>
      </div>
    );
  }

  const totalPayments = rows.length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            Payment records
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-2 text-sm text-gray-600">
            You have {totalPayments} payment record{totalPayments === 1 ? "" : "s"}.
          </p>
        </div>
      </section>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-600">
          {totalPayments} payment record{totalPayments === 1 ? "" : "s"} shown
        </p>
      </div>

      <DataTable columns={columns} data={rows} />
    </div>
  );
}