"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi"
import { useGetAllInstructorsQuery } from "@/lib/redux/features/instructor/instructorApi"
import { useGetAdminPaymentsQuery, useGetAllStudentsQuery } from "@/lib/redux/features/student/studentApi"
import { BookOpen, DollarSign, GraduationCap, ShieldCheck, Star, Users } from "lucide-react"
import React, { useMemo } from "react"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

const AdminStatsCards = () => {
  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourseQuery()
  const { data: students = [], isLoading: studentsLoading } = useGetAllStudentsQuery()
  const { data: instructors = [], isLoading: instructorsLoading } = useGetAllInstructorsQuery()
  const { data: payments = [], isLoading: paymentsLoading } = useGetAdminPaymentsQuery()

  const summaryStats = useMemo(() => {
    const activeCourses = courses.filter((course) => course.status === "Active" || course.isPublished).length
    const totalEnrollments = courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0)
    const totalStudents = students.filter((student) => {
      const role = student.role?.toLowerCase()
      return role === "student" || role === "user"
    }).length
    const totalInstructors = instructors.length
    const totalTransactionAmount = payments.reduce((total, payment) => total + (payment.amount || 0), 0)
    const totalReviews = courses.reduce((total, course) => total + (course.rating?.length || 0), 0)

    return [
      {
        title: "Active Courses",
        value: activeCourses.toString(),
        icon: BookOpen,
        accent: "text-sky-600 bg-sky-50",
      },
      {
        title: "Total Course Enrollments",
        value: totalEnrollments.toString(),
        icon: Users,
        accent: "text-primary bg-violet-50",
      },
      {
        title: "Total Students",
        value: totalStudents.toString(),
        icon: GraduationCap,
        accent: "text-rose-600 bg-rose-50",
      },
      {
        title: "Total Instructors",
        value: totalInstructors.toString(),
        icon: ShieldCheck,
        accent: "text-emerald-600 bg-emerald-50",
      },
      {
        title: "Total Transaction Amount",
        value: formatCurrency(totalTransactionAmount),
        icon: DollarSign,
        accent: "text-emerald-600 bg-emerald-50",
      },
      {
        title: "Total Submitted Reviews",
        value: totalReviews.toString(),
        icon: Star,
        accent: "text-orange-500 bg-orange-50",
      },
    ]
  }, [courses, instructors, payments, students])

  const isLoading = coursesLoading || studentsLoading || instructorsLoading || paymentsLoading

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryStats.map((stat) => (
        <Card key={stat.title} className="border-0 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{isLoading ? "..." : stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.title}</p>
            </div>
            <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.accent}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default AdminStatsCards