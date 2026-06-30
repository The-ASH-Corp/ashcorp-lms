"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Card } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { Logout } from "@/lib/redux/features/auth/authSlice"
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi"
import Link from "next/link"
import { LayoutDashboard, User, BookOpen, History, CreditCard, LogOut } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <User />,
  },
  {
    title: "My Courses",
    url: "/my-courses",
    icon: <BookOpen />,
  },
  {
    title: "Payment History",
    url: "/payment-history",
    icon: <History />,
  },
  {
    title: "Plan & Payment",
    url: "/plan-payment",
    icon: <CreditCard />,
  },
  {
    title: "Logout",
    url: "#",
    isLogout: true,
    icon: <LogOut />,
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    dispatch(Logout());
    router.push("/");
  };

  return (
    <Sidebar variant="floating" className="!top-16 !h-[calc(100svh-4rem)]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Card className="h-full border-0 shadow-none hover:border hover:border-purple-600 hover:shadow-lg hover:shadow-purple-200 hover:scale-105 transition-all duration-300 ease-in-out w-[95%] mx-auto">
                <div className="flex flex-col items-center gap-3 w-full p-2">
                  <Avatar className="h-12 w-12 cursor-pointer">
                    <AvatarImage
                      src={
                        "https://ashacademylms.com/assets/images/profile/demo-profile.png"
                      }
                    />
                  </Avatar>
                  <div className="flex flex-col text-center justify-center">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              </Card>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuSub className="ml-0 border-l-0 px-1.5 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.url;
                  
                  if (item.isLogout) {
                    return (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild className="rounded-xl p-6 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                          <a onClick={handleLogout} className="p-5 flex items-center gap-3 w-full">{item.icon} {item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  }

                  return (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild isActive={isActive} className={`rounded-xl p-6 hover:bg-violet-200 hover:text-white transition-colors ${isActive ? "!bg-violet-600 !text-white" : ""}`}>
                        <Link href={item.url} className="p-5 flex items-center gap-3 w-full">{item.icon} {item.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
