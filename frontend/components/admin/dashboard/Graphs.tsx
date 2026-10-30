"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeleteCourseMutation, useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi"
import { useGetAllInstructorsQuery } from "@/lib/redux/features/instructor/instructorApi"
import { useGetAdminPaymentsQuery, useGetAllStudentsQuery } from "@/lib/redux/features/student/studentApi"
import { ArrowRight, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

type RangeKey = "Daily" | "Monthly" | "Yearly"

interface SalesPoint {
  label: string
  value: number
  count: number
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

const buildRangeData = (payments: Array<{ amount: number; paymentTime: string | null }>, range: RangeKey) => {
  const now = new Date()
  const points: SalesPoint[] = []
  const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (range === "Daily") {
    for (let index = 6; index >= 0; index -= 1) {
      const date = normalizeDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - index))
      const metrics = payments.reduce(
        (total, payment) => {
          if (!payment.paymentTime) return total
          const paymentDate = normalizeDate(new Date(payment.paymentTime))
          if (paymentDate.getTime() !== date.getTime()) return total

          return {
            value: total.value + (payment.amount || 0),
            count: total.count + 1,
          }
        },
        { value: 0, count: 0 },
      )

      points.push({
        label: date.toLocaleDateString("en-IN", { weekday: "short" }),
        value: metrics.value,
        count: metrics.count,
      })
    }
    return points
  }

  if (range === "Monthly") {
    for (let month = 0; month < 12; month += 1) {
      const date = new Date(now.getFullYear(), month, 1)
      const metrics = payments.reduce(
        (total, payment) => {
          if (!payment.paymentTime) return total
          const paymentDate = new Date(payment.paymentTime)
          if (paymentDate.getFullYear() !== date.getFullYear() || paymentDate.getMonth() !== month) return total

          return {
            value: total.value + (payment.amount || 0),
            count: total.count + 1,
          }
        },
        { value: 0, count: 0 },
      )

      points.push({
        label: date.toLocaleDateString("en-IN", { month: "short" }),
        value: metrics.value,
        count: metrics.count,
      })
    }
    return points
  }

  for (let index = 4; index >= 0; index -= 1) {
    const year = now.getFullYear() - index
    const metrics = payments.reduce(
      (total, payment) => {
        if (!payment.paymentTime) return total
        const paymentDate = new Date(payment.paymentTime)
        if (paymentDate.getFullYear() !== year) return total

        return {
          value: total.value + (payment.amount || 0),
          count: total.count + 1,
        }
      },
      { value: 0, count: 0 },
    )

    points.push({
      label: year.toString(),
      value: metrics.value,
      count: metrics.count,
    })
  }

  return points
}

const getChartGeometry = (data: SalesPoint[]) => {
  const width = 680
  const height = 320
  const padding = { top: 24, right: 20, bottom: 36, left: 36 }
  const graphWidth = width - padding.left - padding.right
  const graphHeight = height - padding.top - padding.bottom

  const maxValue = Math.max(...data.map((item) => item.count), 1)

  const points = data.map((item, index) => {
    const x =
      padding.left +
      (index / Math.max(1, data.length - 1)) * graphWidth
    const y = padding.top + graphHeight - (item.count / maxValue) * graphHeight
    return { ...item, x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ")

  const areaPath = `${linePath} L${padding.left + graphWidth},${padding.top + graphHeight} L${padding.left},${padding.top + graphHeight} Z`

  return {
    width,
    height,
    padding,
    graphWidth,
    graphHeight,
    points,
    linePath,
    areaPath,
    maxValue,
  }
}

const describeArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
  const toRadians = (angle: number) => ((angle - 90) * Math.PI) / 180
  const start = {
    x: cx + radius * Math.cos(toRadians(startAngle)),
    y: cy + radius * Math.sin(toRadians(startAngle)),
  }
  const end = {
    x: cx + radius * Math.cos(toRadians(endAngle)),
    y: cy + radius * Math.sin(toRadians(endAngle)),
  }
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

export default function Graphs() {
  const router = useRouter()
  const [range, setRange] = useState<RangeKey>("Daily")
  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourseQuery()
  const [deleteCourse, { isLoading: isDeletingCourse }] = useDeleteCourseMutation()
  const { data: students = [], isLoading: studentsLoading } = useGetAllStudentsQuery()
  const { data: instructors = [], isLoading: instructorsLoading } = useGetAllInstructorsQuery()
  const { data: payments = [], isLoading: paymentsLoading } = useGetAdminPaymentsQuery()

  const salesData = useMemo(() => buildRangeData(payments, range), [payments, range])
  const chartGeometry = useMemo(() => getChartGeometry(salesData), [salesData])

  const topCourses = useMemo(() => {
    const salesByCourse = new Map<string, { id: string; title: string; category: string; sales: number; revenue: number; instructor: string; imageUrl?: string }>()

    payments.forEach((payment) => {
      const existing = salesByCourse.get(payment.courseId) ?? {
        id: payment.courseId,
        title: payment.courseTitle,
        category: "Uncategorized",
        sales: 0,
        revenue: 0,
        instructor: "—",
        imageUrl: undefined,
      }

      existing.sales += 1
      existing.revenue += payment.amount || 0
      salesByCourse.set(payment.courseId, existing)
    })

    courses.forEach((course) => {
      const existing = salesByCourse.get(course.id || (course as { _id?: string })._id || "")
      if (existing) {
        existing.category = course.category || "Uncategorized"
        existing.instructor = course.instructor || "—"
        existing.title = course.title || existing.title
        existing.imageUrl = course.imageUrl || existing.imageUrl
      }
    })

    return Array.from(salesByCourse.values())
      .sort((left, right) => right.sales - left.sales || right.revenue - left.revenue)
      .slice(0, 5)
  }, [courses, payments])

  const overviewStats = useMemo(() => {
    const studentCount = students.filter((student) => {
      const role = student.role?.toLowerCase()
      return role === "student" || role === "user"
    }).length
    const instructorCount = instructors.length
    const courseCount = courses.length
    const enrollmentCount = courses.reduce(
      (total, course) => total + ((course as { enrolledStudents?: string[] }).enrolledStudents?.length || 0),
      0,
    )

    const segments = [
      { label: `${studentCount} Students`, value: studentCount, color: "#5B5CE8" },
      { label: `${instructorCount} Teacher`, value: instructorCount, color: "#2E9E57" },
      { label: `${courseCount} Course`, value: courseCount, color: "#2583F6" },
      { label: `${enrollmentCount} Enrollments`, value: enrollmentCount, color: "#FFC312" },
    ]

    const total = Math.max(segments.reduce((sum, segment) => sum + segment.value, 0), 1)
    let currentAngle = 0

    const chartSegments = segments.map((segment) => {
      const sweep = (segment.value / total) * 360
      const start = currentAngle
      const end = currentAngle + sweep
      currentAngle = end

      return {
        ...segment,
        path: describeArc(120, 120, 92, start, end),
      }
    })

    return {
      total,
      segments: chartSegments,
    }
  }, [courses, instructors, students])

  const navigateEdit = (courseId: string) => {
     router.push(`/admin/course/edit/${courseId}`)
  }

  const totalSalesCount = salesData.reduce((sum, item) => sum + item.count, 0)
  const totalOverviewUsers = overviewStats.segments.reduce((sum, item) => sum + item.value, 0)
  const isLoading = coursesLoading || studentsLoading || instructorsLoading || paymentsLoading

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id).unwrap()
      toast.success("Course deleted successfully")
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to delete course"
      toast.error(message)
    }
  }

  return (
    <div className="gap-6 xl:grid-cols-[1.6fr_1fr]">
      <Card className="mb-5 border-0 bg-white shadow-sm">
        <CardHeader className="flex flex-row gap-4 border-b border-slate-300 px-5 sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-primary">Course & User Statistics</CardTitle>
          </div>
          <div className="inline-flex gap-1 rounded-xl border border-violet-100 bg-violet-50/60 p-1 text-sm">
            {(["Daily", "Monthly", "Yearly"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`cursor-pointer rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  range === tab
                    ? "bg-primary text-white shadow-sm shadow-violet-200"
                    : "text-gray-600 hover:bg-violet-100/70 hover:text-violet-700"
                }`}
                onClick={() => setRange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          {isLoading ? (
            <div className="flex h-56 items-center justify-center text-sm text-slate-500">Loading chart data...</div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-300 bg-primary/10 p-4">
                <h3 className="text-4xl font-semibold text-slate-900">{totalSalesCount}</h3>
                <p className="mt-1 text-xl font-semibold tracking-tight text-indigo-950">Course Sale Overview</p>
                <div className="mt-4 border-t border-slate-300 pt-3">
                  <svg viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`} className="h-90 w-full">
                    <defs>
                      <linearGradient id="salesAreaGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                      const y = chartGeometry.padding.top + chartGeometry.graphHeight * ratio
                      const value = Math.round(chartGeometry.maxValue * (1 - ratio))
                      return (
                        <g key={ratio}>
                          <line
                            x1={chartGeometry.padding.left}
                            y1={y}
                            x2={chartGeometry.padding.left + chartGeometry.graphWidth}
                            y2={y}
                            stroke="#c8abe4ff"
                            strokeWidth="1"
                          />
                          <text
                            x={chartGeometry.padding.left - 8}
                            y={y + 4}
                            fontSize="11"
                            textAnchor="end"
                            fill="#c8abe4ff"
                          >
                            {value}
                          </text>
                        </g>
                      )
                    })}

                    <path d={chartGeometry.areaPath} fill="url(#salesAreaGradient)" />
                    <path
                      d={chartGeometry.linePath}
                      fill="none"
                      stroke="#A855F7"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {chartGeometry.points.map((point) => (
                      <circle key={`${point.label}-dot`} cx={point.x} cy={point.y} r="4" fill="#A855F7" />
                    ))}

                    {chartGeometry.points.map((point) => (
                      <text
                        key={`${point.label}-x`}
                        x={point.x}
                        y={chartGeometry.padding.top + chartGeometry.graphHeight + 24}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#334155"
                      >
                        {point.label}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-primary/10 p-4">
                <h3 className="text-4xl font-semibold text-slate-900">{totalOverviewUsers}</h3>
                <p className="mt-1 text-xl font-semibold tracking-tight text-indigo-950">New User Overview</p>

                <div className="mt-4 border-t border-slate-200 pt-3">
                  <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    {overviewStats.segments.map((segment) => (
                      <div key={segment.label} className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-10 rounded-sm"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span>{segment.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <svg viewBox="0 0 240 240" className="h-75 w-75 max-w-full">
                      {overviewStats.segments.map((segment) => (
                        <path
                          key={segment.label}
                          d={segment.path}
                          fill="none"
                          stroke={segment.color}
                          strokeWidth="52"
                          strokeLinecap="butt"
                        />
                      ))}
                      <circle cx="120" cy="120" r="56" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <CardHeader className="flex items-center justify-between px-5">
          <div>
            <CardTitle className="text-base font-semibold text-indigo-950">Top Selling Course (Latest 5)</CardTitle>
            <p className="mt-1 text-sm text-gray-500">Latest performance by course.</p>
          </div>
          <Link href="/admin/course" className="flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80">
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  #
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Course
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Sales
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Revenue
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Instructor
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCourses.length === 0 ? (
                <TableRow className="border-b border-gray-50">
                  <TableCell colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                    No purchases recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                topCourses.map((course, index) => (
                  <TableRow
                    key={course.id}
                    className="border-b border-gray-50 transition-colors hover:bg-violet-50/30"
                  >
                    <TableCell className="px-4 py-3 text-center align-middle text-sm font-semibold text-gray-900">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <Image
                          src={course.imageUrl || ""}
                          alt={course.title}
                          className="h-12 w-12 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-contain"
                          width={48}
                          height={48}
                          unoptimized
                        />
                        <span className="text-sm font-semibold text-gray-900">{course.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">{course.category}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">{course.sales}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(course.revenue)}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <span className="text-sm font-medium text-gray-700">{course.instructor}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigateEdit(course.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 transition-colors hover:bg-violet-50 hover:text-primary"
                          title="Edit course"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <ConfirmActionDialog
                          title="Delete Course"
                          description={`This will permanently delete ${course.title}.`}
                          confirmLabel="Delete"
                          loading={isDeletingCourse}
                          loadingLabel="Deleting..."
                          onConfirm={() => handleDelete(course.id)}
                          trigger={
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
