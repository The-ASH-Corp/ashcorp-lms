"use client";

import React, { useState } from "react";
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
import { useAppDispatch } from "@/lib/redux/hooks";
import { Logout } from "@/lib/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import {
  LayoutDashboard,
  BookOpen,
  Image as ImageIcon,
  GraduationCap,
  Users,
  Wallet,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Ticket,
  BookOpenCheck,
  NotebookText,
} from "lucide-react";
import Image from "next/image";
import { LogoutConfirmationModal } from "@/components/shared/logout-confirmation-modal";
import { AppLogo } from "@/components/ui/app-logo";

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },

  {
    title: "Course Management",
    url: "/admin/course",
    icon: BookOpen,
    children: [
      { title: "Category", url: "/admin/category" },
      { title: "Course", url: "/admin/course" },
      { title: "Chapter", url: "/admin/chapter" },
    ],
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
    title: "Exam",
    url: "/admin/exam",
    icon: BookOpenCheck,
  },
  {
    title: "Certificate",
    url: "/admin/certificate",
    icon: NotebookText,
  },
  {
    title: "Graduates",
    url: "/admin/graduates",
    icon: GraduationCap,
  },
  {
    title: "Coupons",
    url: "/admin/coupon",
    icon: Ticket,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: Wallet,
  },
  {
    title: "Page Settings",
    url: "/admin/page-settings",
    icon: Settings,
    children: [
      { title: "General", url: "/admin/page-settings/general" },
      { title: "Homepage", url: "/admin/page-settings/homepage" },
      { title: "About", url: "/admin/page-settings/about" },
      { title: "Contact", url: "/admin/page-settings/contact" },
      { title: "Privacy Policy", url: "/admin/page-settings/privacy-policy" },
      { title: "Terms & Conditions", url: "/admin/page-settings/terms-conditions" },
      { title: "Auth Page", url: "/admin/page-settings/auth" },
    ],
  },
];

const hasMatchingChild = (item: any, currentPath: string): boolean => {
  if (!item.children) return false;
  return item.children.some((c: any) => {
    if (c.children) {
      return c.children.some(
        (cc: any) => currentPath === cc.url || currentPath.startsWith(`${cc.url}/`),
      );
    }
    return currentPath === c.url || currentPath.startsWith(`${c.url}/`);
  });
};

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
        // open group if any child matches current path
        initial[it.title] = hasMatchingChild(it, pathname);
      }
    });
    return initial;
  });

  React.useEffect(() => {
    navItems.forEach((it) => {
      if (it.children && hasMatchingChild(it, pathname)) {
        setOpen((prev) => (prev[it.title] ? prev : { ...prev, [it.title]: true }));
      }
    });
  }, [pathname]);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      dispatch(Logout());
      setShowLogoutModal(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
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
          <AppLogo width={90} height={90} />
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navItems.map((item: any) => {
              const isActive = item.children
                ? hasMatchingChild(item, pathname)
                : item.url === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.url || pathname.startsWith(`${item.url}/`);

              if (!item.children) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-xl px-4 py-6 text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary! text-white! shadow-md shadow-violet-200"
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
                      // isActive
                      //   ? "bg-sky-100 text-sky-700"
                      //   : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                      isActive
                          ? "bg-primary! text-white! shadow-md shadow-violet-200"
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
                    <div className="ml-8 flex flex-col gap-3">
                      {item.children.map((child: any, _idx: number) => {
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
                                    pathname.startsWith(`${cc.url}/`);
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
                          pathname.startsWith(`${child.url}/`);
                        return (
                          <Link
                            key={child.title}
                            href={child.url}
                            className={`block rounded-xl px-4 py-3 text-[13px] font-medium ${isChildActive ? "bg-sky-100 text-sky-700" : "bg-gray-50 text-gray-600"} transition-colors`}
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
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="rounded-xl px-4 py-5 text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <LogoutConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />
    </Sidebar>
  );
}
