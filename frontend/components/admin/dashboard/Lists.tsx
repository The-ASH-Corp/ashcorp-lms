"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi"
import { useGetAllInstructorsQuery } from "@/lib/redux/features/instructor/instructorApi"
import { useGetAdminPaymentsQuery } from "@/lib/redux/features/student/studentApi"
import { GraduationCap, Users } from "lucide-react"
import { useMemo } from "react"

export default function Lists() {
  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourseQuery()
  const { data: instructors = [], isLoading: instructorsLoading } = useGetAllInstructorsQuery()
  const { data: payments = [], isLoading: paymentsLoading } = useGetAdminPaymentsQuery()

  const topStudents = useMemo(() => {
    const purchasesByStudent = new Map<string, { name: string; email: string; courses: number }>()

    payments.forEach((payment) => {
      const current = purchasesByStudent.get(payment.studentId) ?? {
        name: payment.studentName,
        email: payment.studentEmail,
        courses: 0,
      }

      current.courses += 1
      purchasesByStudent.set(payment.studentId, current)
    })

    return Array.from(purchasesByStudent.values())
      .sort((left, right) => right.courses - left.courses)
      .slice(0, 5)
  }, [payments])

  const topInstructors = useMemo(() => {
    const instructorStats = new Map<string, { name: string; total: number; rating: string }>()

    courses.forEach((course) => {
      const instructorName = course.instructor || "Unassigned"
      const current = instructorStats.get(instructorName) ?? {
        name: instructorName,
        total: 0,
        rating: "0.0",
      }

      current.total += 1
      instructorStats.set(instructorName, current)
    })

    instructors.forEach((instructor) => {
      const current = instructorStats.get(instructor.name)
      if (current) {
        current.rating = instructor.rating ?? "0.0"
      }
    })

    return Array.from(instructorStats.values())
      .sort((left, right) => right.total - left.total)
      .slice(0, 5)
  }, [courses, instructors])

  const isLoading = coursesLoading || instructorsLoading || paymentsLoading

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card className="border-0 bg-white shadow-sm">
        <CardHeader className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
          <CardTitle className="text-base font-semibold text-slate-900">Top 5 Student</CardTitle>
          <span className="text-sm text-slate-500">Buy Courses</span>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {isLoading ? (
            <div className="text-sm text-slate-500">Loading student activity…</div>
          ) : topStudents.length === 0 ? (
            <div className="text-sm text-slate-500">No purchase activity yet.</div>
          ) : (
            topStudents.map((student) => (
              <div
                key={student.email}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600">
                  Buy Courses : {student.courses}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white shadow-sm">
        <CardHeader className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
          <CardTitle className="text-base font-semibold text-slate-900">Top 5 Instructor</CardTitle>
          <span className="text-sm text-slate-500">Total Courses</span>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {isLoading ? (
            <div className="text-sm text-slate-500">Loading instructor activity…</div>
          ) : topInstructors.length === 0 ? (
            <div className="text-sm text-slate-500">No instructor course data yet.</div>
          ) : (
            topInstructors.map((instructor) => (
              <div
                key={instructor.name}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{instructor.name}</p>
                    <p className="text-sm text-slate-500">{instructor.rating} ⭐</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600">
                  {instructor.total}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}