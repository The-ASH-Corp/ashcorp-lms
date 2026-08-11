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
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
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
import Logo from "../../public/images/logo.webp"

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {data:categories}=useGetAllCategoriesQuery()
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(Logout());
  };
  
  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    if (selectedCategory) {
      router.push(`/courses?category=${encodeURIComponent(selectedCategory)}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = (path: string) =>
    `relative pb-1 transition-colors ${
      pathname === path
        ? "text-primary font-semibold border-b-2 border-primary"
        : "text-gray-600 hover:text-primary"
    }`;

    const route =user?.role == "admin" ? "/admin" :"/dashboard"
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="Logo"
              width={90}
              height={90}
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NativeSelect
              className="w-32 border-0 bg-transparent text-gray-600 cursor-pointer"
              onChange={handleCategorySelect}
              defaultValue=""
            >
              <NativeSelectOption value="">Categories</NativeSelectOption>

              {categories?.map((category) => (
                <NativeSelectOption key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </NativeSelectOption>
              ))}
            </NativeSelect>
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
                  <DropdownMenuItem onClick={() => handleLogout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-all shadow-md shadow-purple-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 text-primary transition-colors hover:bg-purple-50 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm border-l border-purple-100 bg-white p-0">
              <SheetHeader className="border-b border-purple-100 px-5 py-4">
                <SheetTitle className="text-base font-semibold text-indigo-950">
                  Navigation
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-5 px-5 py-5">
                <NativeSelect
                  className="w-full rounded-xl border border-purple-100 bg-white px-3 py-2 text-gray-700"
                  onChange={handleCategorySelect}
                  defaultValue=""
                >
                  <NativeSelectOption value="">Categories</NativeSelectOption>

                  {categories?.map((category) => (
                    <NativeSelectOption key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>

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
                        onClick={handleLogout}
                        className="rounded-full border border-purple-200 px-4 py-2 text-xs font-semibold text-primary"
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
    </header>
  );
}
