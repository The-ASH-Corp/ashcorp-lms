"use client"

import AdminStatsCards from "@/components/admin/dashboard/StatsCards"
import Graphs from "@/components/admin/dashboard/Graphs"
import Lists from "@/components/admin/dashboard/Lists"



export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Admin Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Monitor platform health, course insights, and active user metrics in one place.
          </p>
        </div>
      </div>

     <AdminStatsCards />

      <Graphs />

      <Lists />
    </div>
  )
}
