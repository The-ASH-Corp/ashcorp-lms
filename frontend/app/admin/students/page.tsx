"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  UserPlus,
  Mail,
  Copy,
  Trash2,
  Pencil,
  MoreVertical,
  Filter,
  ChevronDown,
  RefreshCw,
  ClipboardList,
  ShieldCheck,
  Info,
} from "lucide-react"

/* ─── Stat Cards Data ─── */
const statCards = [
  {
    title: "Total Enrollment",
    value: "3,492",
    badge: "+12% this month",
    icon: Users,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badgeColor: "text-violet-600",
  },
  {
    title: "Active Learners",
    value: "1,284",
    badge: "84% Completion",
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeColor: "text-blue-600",
  },
  {
    title: "Certifications Issued",
    value: "892",
    badge: "Verified profiles",
    icon: Award,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeColor: "text-emerald-600",
  },
  {
    title: "Revenue Performance",
    value: "$124K",
    badge: "Record High",
    icon: TrendingUp,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeColor: "text-red-500",
  },
]

/* ─── Mock Students Data ─── */
const students = [
  {
    id: 1,
    name: "Elena Sterling",
    email: "elena.s@academy.edu",
    avatar: "ES",
    programs: ["Web Architecture"],
    extraPrograms: 2,
    progress: 78,
    status: "Active" as const,
  },
  {
    id: 2,
    name: "Julian Vance",
    email: "j.vance@tech.co",
    avatar: "JV",
    programs: ["Data Science"],
    extraPrograms: 0,
    progress: 42,
    status: "On Hold" as const,
  },
  {
    id: 3,
    name: "Marcus Thorne",
    email: "m.thorne@future.org",
    avatar: "MT",
    programs: ["Machine Learning", "Cloud Ops"],
    extraPrograms: 0,
    progress: 95,
    status: "Active" as const,
  },
  {
    id: 4,
    name: "Amara Okafor",
    email: "amara@design.lab",
    avatar: "AO",
    programs: ["UI/UX Advanced"],
    extraPrograms: 0,
    progress: 15,
    status: "Inactive" as const,
  },
]

const statusStyles: Record<string, { dot: string; bg: string; text: string }> = {
  Active: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  "On Hold": { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  Inactive: { dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600" },
}

/* ─── Growth Chart Data ─── */
const growthData = [
  { month: "JAN", value: 40, light: true },
  { month: "FEB", value: 65, light: false },
  { month: "MAR", value: 55, light: false },
  { month: "APR", value: 50, light: true },
  { month: "MAY", value: 80, light: false },
  { month: "JUN", value: 70, light: true },
]

export default function StudentsPage() {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [currentPage] = useState(1)

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map((s) => s.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Students Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-gray-700">1,284</span> active
            students enrolled across{" "}
            <span className="font-semibold text-gray-700">42</span> specialized
            programs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 h-10 px-4"
          >
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button className="rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700 h-10 px-5">
            <UserPlus className="h-4 w-4 mr-2" />
            Enroll Student
          </Button>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
          >
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <span
                  className={`text-xs font-medium ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Filters & Bulk Actions ─── */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Course Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl border-gray-200 text-gray-700 h-10 min-w-[140px] justify-between hover:border-violet-300"
                  >
                    All Courses
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem>All Courses</DropdownMenuItem>
                  <DropdownMenuItem>Web Architecture</DropdownMenuItem>
                  <DropdownMenuItem>Data Science</DropdownMenuItem>
                  <DropdownMenuItem>Machine Learning</DropdownMenuItem>
                  <DropdownMenuItem>UI/UX Advanced</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl border-gray-200 text-gray-700 h-10 min-w-[140px] justify-between hover:border-violet-300"
                  >
                    All Statuses
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>On Hold</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Advanced Filters */}
              <Button
                variant="ghost"
                className="text-violet-600 hover:bg-violet-50 hover:text-violet-700 h-10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 mr-2">Bulk Actions:</span>
              {[
                { icon: Mail, label: "Email" },
                { icon: Copy, label: "Copy" },
                { icon: Download, label: "Download" },
                { icon: Trash2, label: "Delete" },
              ].map((action) => (
                <button
                  key={action.label}
                  title={action.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
                >
                  <action.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Data Table ─── */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
              <TableHead className="w-12 pl-5">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === students.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600"
                />
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Student Details
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Enrolled Programs
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Global Progress
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const style = statusStyles[student.status]

              return (
                <TableRow
                  key={student.id}
                  className="hover:bg-violet-50/30 transition-colors border-b border-gray-50"
                >
                  {/* Checkbox */}
                  <TableCell className="pl-5">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600"
                    />
                  </TableCell>

                  {/* Student Details */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${student.name}&backgroundColor=7c3aed&textColor=ffffff`}
                          alt={student.name}
                        />
                        <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-semibold">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Enrolled Programs */}
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      {student.programs.map((prog) => (
                        <span
                          key={prog}
                          className="inline-flex items-center rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200/60"
                        >
                          {prog}
                        </span>
                      ))}
                      {student.extraPrograms > 0 && (
                        <span className="text-xs text-gray-500 font-medium">
                          +{student.extraPrograms} more
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Global Progress */}
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <span className="text-sm font-semibold text-gray-900 w-10">
                        {student.progress}%
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-500 transition-all duration-500"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                      />
                      {student.status}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">1 - 10</span>{" "}
            of <span className="font-semibold text-gray-700">1,284</span>{" "}
            students
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  className="h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                />
              </PaginationItem>
              {[1, 2, 3].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    className={`h-8 w-8 rounded-lg text-sm ${
                      page === currentPage
                        ? "bg-violet-600! text-white! border-violet-600! hover:bg-violet-700!"
                        : "border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-8 w-8 rounded-lg text-sm border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                >
                  128
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  className="h-8 w-8 p-0 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      {/* ─── Bottom Section: Growth Analysis + Quick Shortcuts ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Growth Analysis */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="pt-5">
            <h3 className="text-base font-bold text-gray-900">
              Growth Analysis
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Student acquisition has increased by 14% compared to the previous
              academic quarter.
            </p>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-44">
              {growthData.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="w-full relative flex items-end justify-center h-36">
                    <div
                      className={`w-full max-w-[42px] rounded-lg transition-all duration-500 ${
                        item.light ? "bg-violet-200" : "bg-violet-500"
                      }`}
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Shortcuts */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="pt-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Quick Shortcuts
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: "Broadcast Email", color: "text-violet-600" },
                { icon: ShieldCheck, label: "Review Roles", color: "text-blue-600" },
                { icon: ClipboardList, label: "Download Logs", color: "text-emerald-600" },
                { icon: ShieldCheck, label: "Compliance Check", color: "text-red-500" },
              ].map((shortcut) => (
                <button
                  key={shortcut.label}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm group"
                >
                  <shortcut.icon
                    className={`h-5 w-5 ${shortcut.color} group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-violet-700">
                    {shortcut.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Sync Banner */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3 ring-1 ring-violet-100">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-violet-500" />
                <span className="text-xs text-violet-700">
                  Data automatically updates every 5 minutes.
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-violet-700 hover:bg-violet-100 hover:text-violet-800 h-7 px-3"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                SYNC NOW
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
