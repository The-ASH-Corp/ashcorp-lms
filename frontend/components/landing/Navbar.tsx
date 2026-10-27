"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Logout } from "@/lib/redux/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { usePathname, useRouter } from "next/navigation";
import { useGetAllCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { getUserProfileImageFromUser } from "@/lib/auth/profileImage";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { AppLogo } from "../ui/app-logo";
import { LogoutConfirmationModal } from "@/components/shared/logout-confirmation-modal";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: categories } = useGetAllCategoriesQuery()
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      dispatch(Logout());
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    if (selectedCategory) {
      router.push(`/courses?category=${encodeURIComponent(selectedCategory)}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = (path: string) =>
    `relative inline-flex items-center py-1 text-sm font-medium transition-colors ${pathname === path
      ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
      : "text-gray-600 hover:text-primary"
    }`;

  const route = user?.role == "admin" ? "/admin" : "/dashboard"
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[120rem] items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo width={90} height={90} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Select value="" onValueChange={handleCategorySelect}>
              <SelectTrigger className="h-auto w-auto gap-1 border-0 bg-transparent px-0 py-1 text-sm font-medium text-gray-600 shadow-none hover:text-primary focus:ring-0 focus-visible:ring-0 data-[size=default]:h-auto data-placeholder:text-gray-600 hover:data-placeholder:text-primary cursor-pointer [&>svg]:size-3.5 [&>svg]:text-gray-600 hover:[&>svg]:text-primary transition-colors">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category.categoryName} className="cursor-pointer bg-white text-gray-700 data-[highlighted]:bg-gray-200 data-[highlighted]:text-white">
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Link href="/courses" className={navLinkClass("/courses")}>
              Courses
            </Link>

            <Link href="/about" className={navLinkClass("/about")}>
              About Us
            </Link>

            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <div className=" text-sm font-medium text-gray-700 ">
                  <span>{user.name ?? user.email}</span>
                </div>
                <div className=" text-xs font-medium text-gray-700 ">
                  <span>{user.email ?? user.name}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-12 w-12 cursor-pointer">
                    <AvatarImage
                      src={getUserProfileImageFromUser(user)}
                    />
                    <AvatarFallback>
                      {user.name?.split(" ")[0][0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={route}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-all shadow-md shadow-purple-200 hover:bg-purple-700 hover:shadow-md hover:shadow-purple-300 hover:bg-purple-700"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 text-primary transition-colors hover:bg-purple-50 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm border-l border-purple-100 bg-white p-0">
              <SheetHeader className="h-16 border-b border-purple-100 px-5 py-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>

              <div className="space-y-5 px-5 py-5">
                <Select value="" onValueChange={handleCategorySelect}>
                  <SelectTrigger className="w-full justify-between rounded-xl border border-purple-100 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-none focus:ring-0 focus-visible:ring-0 data-placeholder:text-gray-700 cursor-pointer">
                    <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category.categoryName} className="cursor-pointer">
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <nav className="flex flex-col gap-2 text-sm">
                  <SheetClose asChild>
                    <Link
                      href="/courses"
                      className="rounded-xl px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-primary"
                    >
                      Courses
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/about"
                      className="rounded-xl px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-primary"
                    >
                      About Us
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/contact"
                      className="rounded-xl px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-primary"
                    >
                      Contact Us
                    </Link>
                  </SheetClose>
                </nav>

                {user ? (
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Signed in as
                    </p>
                    <p className="mt-1 text-sm font-medium text-indigo-950">
                      {user.name ?? user.email}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <SheetClose asChild>
                        <Link
                          href={route}
                          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
                        >
                          Dashboard
                        </Link>
                      </SheetClose>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="rounded-full border border-purple-200 px-4 py-2 text-xs font-semibold text-primary cursor-pointer hover:bg-purple-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Login
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <LogoutConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />
    </header>
  );
}
