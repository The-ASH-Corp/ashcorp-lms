"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine if we're on the dashboard (root admin page)
  const isDashboard = pathname === "/admin"

  // Build breadcrumb from path segments
  const segments = pathname
    .replace("/admin", "")
    .split("/")
    .filter(Boolean)

  const formatSegment = (seg: string) =>
    seg
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  return (
    <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/dashboard">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <SidebarInset className="bg-gray-50/50">
          <AdminNavbar />

          {/* Breadcrumb - hidden on Dashboard */}
          {!isDashboard && segments.length > 0 && (
            <div className="px-6 pt-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/admin"
                      className="text-gray-500 hover:text-primary transition-colors text-sm"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1
                    const href =
                      "/admin/" +
                      segments.slice(0, index + 1).join("/")

                    return (
                      <span key={segment} className="contents">
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="text-violet-700 font-medium text-sm">
                              {formatSegment(segment)}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={href}
                              className="text-gray-500 hover:text-primary transition-colors text-sm"
                            >
                              {formatSegment(segment)}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </span>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          {/* Page Content */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
