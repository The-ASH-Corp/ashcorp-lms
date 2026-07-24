"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { usePathname } from "next/navigation";
import { useGetAllCategoriesQuery } from "@/lib/redux/features/category/categoryApi";

export default function Navbar() {
  const {data:categories}=useGetAllCategoriesQuery()
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(Logout());
  };
  

  const navLinkClass = (path: string) =>
    `relative pb-1 transition-colors ${
      pathname === path
        ? "text-primary font-semibold border-b-2 border-primary"
        : "text-gray-600 hover:text-primary"
    }`;

    const route =user?.role == "admin" ? "/admin" :"/dashboard"
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://ashacademylms.com/storage/setting/logo/xrDvetmZgdczqHBL4GDygfTgdeyzPmZyq0Fa6Eo8.png"
              alt="Logo"
              width={90}
              height={90}
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NativeSelect className="w-32 border-0 bg-transparent text-gray-600">
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
                      src={
                        "https://ashacademylms.com/assets/images/profile/demo-profile.png"
                      }
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
        </div>
      </div>
    </header>
  );
}
