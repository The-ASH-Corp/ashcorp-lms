"use client"

import * as React from "react"

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
import { useAppSelector } from "@/lib/redux/hooks"


const data = {
  navMain: [
    {
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "#",
          isActive: true,
        },
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "My Courses",
          url: "#",
        },
        {
          title: "Payment History",
          url: "#",
        },
        {
          title: "Plan & Payment",
          url: "#",
        },
        {
          title: "Logout",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user);
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
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title || " "}>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5 gap-5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive} className={`rounded-xl p-3 hover:bg-violet-100 hover:text-black ${item.isActive ? "bg-violet-500 text-black" : ""}`}>
                          <a href={item.url} className="p-5">{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
