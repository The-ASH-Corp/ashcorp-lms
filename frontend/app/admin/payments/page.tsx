"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { useGetAdminPaymentsQuery } from "@/lib/redux/features/student/studentApi";
import { PropagateLoader } from "react-spinners";

const PAGE_SIZE = 10;

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: payments = [], isLoading, isError } = useGetAdminPaymentsQuery();

  const totalPayments = payments.length;
  const totalPages = Math.max(1, Math.ceil(totalPayments / PAGE_SIZE));
  const resolvedPage = Math.min(currentPage, totalPages);
  const paginatedPayments = payments.slice(
    (resolvedPage - 1) * PAGE_SIZE,
    resolvedPage * PAGE_SIZE,
  );

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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-indigo-950">Payments</h1>
        
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Student
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Course
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Amount
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payment Method
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Purchased On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="px-4 py-16 text-center text-sm text-gray-500">
                  No payments found yet.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayments.map((payment, index) => (
                <TableRow
                  key={`${payment.studentId}-${payment.courseId}-${payment.paymentId}`}
                  className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                >
                  <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                    {index + 1 + (resolvedPage - 1) * PAGE_SIZE}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    <div className="flex flex-col items-center text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {payment.studentName}
                      </span>
                      <span className="text-xs text-gray-500">{payment.studentEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="text-sm font-medium text-gray-700">
                      {payment.courseTitle}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="text-sm font-medium text-gray-700">
                      ₹{payment.amount}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {payment.methodOfPayment}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    <span className="text-sm font-medium text-gray-700">
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{paginatedPayments.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalPayments}</span> payments.
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
