"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAdminPaymentsQuery } from "@/lib/redux/features/student/studentApi";
import { PropagateLoader } from "react-spinners";

export default function PaymentsPage() {
  const { data: payments, isLoading, isError } = useGetAdminPaymentsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={15} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">
          A complete list of course purchases, payment amounts, and purchase dates.
        </p>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Student
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Course
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Amount
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payment Method
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Purchased On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!payments?.length ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-16 text-center text-gray-500">
                  No payments found yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, index) => (
                <TableRow
                  key={`${payment.studentId}-${payment.courseId}-${payment.paymentId}`}
                  className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                >
                  <TableCell className="text-center font-semibold text-gray-900">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {payment.studentName}
                      </span>
                      <span className="text-xs text-gray-500">{payment.studentEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {payment.courseTitle}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-violet-700">
                      ₹{payment.amount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {payment.methodOfPayment}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-600">
                      {payment.paymentTime
                        ? new Date(payment.paymentTime).toLocaleString("en-IN")
                        : "N/A"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}