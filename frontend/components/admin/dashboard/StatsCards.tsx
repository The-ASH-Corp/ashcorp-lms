import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, DollarSign, GraduationCap, ShieldCheck, Star, Users } from 'lucide-react'
import React from 'react'

const summaryStats = [
  {
    title: "Active Courses",
    value: "8",
    icon: BookOpen,
    accent: "text-sky-600 bg-sky-50",
  },
  {
    title: "Total Course Enrollments",
    value: "26",
    icon: Users,
    accent: "text-primary bg-violet-50",
  },
  {
    title: "Total Students",
    value: "136",
    icon: GraduationCap,
    accent: "text-rose-600 bg-rose-50",
  },
  {
    title: "Total Instructors",
    value: "8",
    icon: ShieldCheck,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Total Transaction Amount",
    value: "₹23.00",
    icon: DollarSign,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Total Submitted Reviews",
    value: "3",
    icon: Star,
    accent: "text-orange-500 bg-orange-50",
  },
]
const AdminStatsCards = () => {
  return (
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryStats.map((stat) => (
              <Card key={stat.title} className="border-0 bg-white shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
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