"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { Logout } from "@/lib/redux/features/auth/authSlice"
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Bell, Settings, HelpCircle } from "lucide-react"

export function AdminNavbar() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    await logout()
    dispatch(Logout())
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-violet-100 bg-white/90 backdrop-blur-md px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-gray-500 hover:text-primary md:hidden" />

        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, ID or email..."
            className="h-10 w-72 rounded-xl border-gray-200 bg-gray-50/80 pl-10 text-sm placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-violet-200 lg:w-96"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Icon Buttons */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-violet-50 hover:text-primary">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-violet-50 hover:text-primary">
          <Settings className="h-[18px] w-[18px]" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-violet-50 hover:text-primary">
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        {/* Divider */}
        <div className="mx-2 hidden h-8 w-px bg-gray-200 lg:block" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-violet-50 cursor-pointer">
              <div className="hidden flex-col items-end lg:flex">
                <span className="text-sm font-semibold text-gray-900">
                  {user?.name || "Admin User"}
                </span>
                <span className="text-[11px] text-gray-500">
                   Administrator
                </span>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-violet-100">
                <AvatarImage
                  src="https://ashacademylms.com/assets/images/profile/demo-profile.png"
                  alt="Admin"
                />
                <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link href="/admin" className="w-full">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
