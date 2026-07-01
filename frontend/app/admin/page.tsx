"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"

const stats = [
  {
    title: "Total Students",
    value: "3,492",
    change: "+12% this month",
    icon: Users,
    color: "violet",
  },
  {
    title: "Active Courses",
    value: "128",
    change: "+5 new",
    icon: BookOpen,
    color: "blue",
  },
  {
    title: "Certifications",
    value: "892",
    change: "Verified profiles",
    icon: GraduationCap,
    color: "emerald",
  },
  {
    title: "Revenue",
    value: "$124K",
    change: "Record High",
    icon: TrendingUp,
    color: "amber",
  },
]

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    badge: "text-violet-600 bg-violet-100",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "text-blue-600 bg-blue-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    badge: "text-emerald-600 bg-emerald-100",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    badge: "text-amber-600 bg-amber-100",
  },
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color]
          return (
            <Card
              key={stat.title}
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
                  >
                    <stat.icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Placeholder content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-violet-400" />
                  <div className="flex-1">
                    <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                  </div>
                  <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Add Student", "Create Course", "Send Broadcast", "View Reports"].map(
                (action) => (
                  <button
                    key={action}
                    className="rounded-xl border border-gray-200 p-4 text-left text-sm font-medium text-gray-700 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}