"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Logout } from "@/lib/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

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
    children: [
      {
        title: "Plan Management",
        url: "/admin/subscriptions/plans",
        children: [
          { title: "Plan List", url: "/admin/subscriptions/plans" },
          {
            title: "Create New Plan",
            url: "/admin/subscriptions/plans/create",
          },
        ],
      },
      {
        title: "Subscriber Management",
        url: "/admin/subscriptions/subscribers",
      },
    ],
  },
  {
    title: "Course Management",
    url: "/admin/courses",
    icon: BookOpen,
    children: [
      { title: "Category", url: "/admin/courses/category" },
      { title: "Course", url: "/admin/courses/course" },
      { title: "Chapter", url: "/admin/courses/chapter" },
    ],
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
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navItems.forEach((it) => {
      if (it.children) {
        // open group if current path starts with group url or any child matches
        const matchChild = it.children.some((c: any) => {
          if (c.children) {
            return c.children.some((cc: any) => pathname.startsWith(cc.url));
          }
          return pathname.startsWith(c.url);
        });
        initial[it.title] = pathname.startsWith(it.url) || matchChild;
      }
    });
    return initial;
  });

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    dispatch(Logout());
    router.push("/");
  };

  return (
    <Sidebar
      variant="sidebar"
      className="border-r border-violet-100 bg-white!"
      {...props}
    >
      {/* Brand Header */}
      <SidebarHeader className="px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3 justify-center">
          <Image
            src="https://ashacademylms.com/storage/setting/logo/xrDvetmZgdczqHBL4GDygfTgdeyzPmZyq0Fa6Eo8.png"
            alt="Logo"
            width={90}
            height={90}
          />
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navItems.map((item: any) => {
              const isActive =
                item.url === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.url);

              if (!item.children) {
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
                );
              }

              // Grouped item
              const isOpen = !!open[item.title];

              return (
                <SidebarMenuItem key={item.title} className="relative">
                  <SidebarMenuButton
                    className={`w-full rounded-xl px-4 py-6 text-[13px] font-medium flex items-center justify-between transition-all duration-200 ${
                      isActive
                        ? "bg-sky-100 text-sky-700"
                        : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                    onClick={() =>
                      setOpen((s) => ({ ...s, [item.title]: !s[item.title] }))
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </SidebarMenuButton>

                  {/* Nested children */}
                  {isOpen && (
                    <div className="mt-3 ml-8 flex flex-col gap-3">
                      {item.children.map((child: any, _idx: number) => {
                        // if child has its own children (like Plan Management -> Plan List, Create)
                        if (child.children) {
                          const childActive = child.children.some((cc: any) =>
                            pathname.startsWith(cc.url),
                          );
                          return (
                            <div key={child.title} className="flex flex-col">
                              <div
                                className={`rounded-xl px-4 py-3 text-[13px] font-medium ${childActive ? "bg-sky-100 text-sky-700" : "bg-white text-gray-600"}`}
                              >
                                {child.title}
                              </div>
                              <div className="mt-2 ml-4 flex flex-col gap-2">
                                {child.children.map((cc: any) => {
                                  const isChildActive =
                                    pathname === cc.url ||
                                    pathname.startsWith(cc.url);
                                  return (
                                    <Link
                                      key={cc.title}
                                      href={cc.url}
                                      className={`block rounded-xl px-4 py-3 text-[13px] font-medium ${isChildActive ? "bg-sky-100 text-sky-700" : "bg-gray-50 text-gray-600"} transition-colors`}
                                    >
                                      {cc.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        const isChildActive =
                          pathname === child.url ||
                          pathname.startsWith(child.url);
                        return (
                          <Link
                            key={child.title}
                            href={child.url}
                            className={`block rounded-xl px-4 py-4 text-[13px] font-medium ${isChildActive ? "bg-sky-100 text-sky-700" : "bg-gray-50 text-gray-600"} transition-colors`}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 pb-5 space-y-1">
        <Button className="w-full rounded-xl bg-violet-600 py-5 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors">
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
                <Settings className="h-4.5 w-4.5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="rounded-xl px-4 py-5 text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
