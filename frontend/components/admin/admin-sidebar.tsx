"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { Logout } from "@/lib/redux/features/auth/authSlice"
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi"
import {
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Image as ImageIcon,
  GraduationCap,
  Users,
  Building2,
  Wallet,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Subscriptions",
    url: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Course Management",
    url: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Banners",
    url: "/admin/banners",
    icon: ImageIcon,
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Instructors",
    url: "/admin/instructors",
    icon: Users,
  },
  {
    title: "Companies",
    url: "/admin/companies",
    icon: Building2,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: Wallet,
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout()
    dispatch(Logout())
    router.push("/")
  }

  return (
    <Sidebar
      variant="sidebar"
      className="border-r border-violet-100 bg-white!"
      {...props}
    >
      {/* Brand Header */}
      <SidebarHeader className="px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 tracking-tight">Ash Academy</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-600">
              Admin Console
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive =
                item.url === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.url)

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`rounded-xl px-4 py-6 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-violet-600! text-white! shadow-md shadow-violet-200"
                        : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 pb-5 space-y-1">
        <Button
          className="w-full rounded-xl bg-violet-600 py-5 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors"
        >
          <FileBarChart className="h-4 w-4 mr-2" />
          Generate Report
        </Button>

        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl px-4 py-5 text-[13px] font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <Link href="/admin/settings" className="flex items-center gap-3">
                <Settings className="h-[18px] w-[18px]" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="rounded-xl px-4 py-5 text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
