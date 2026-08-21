"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppLogo } from "../ui/app-logo";
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
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { getUserProfileImageFromUser } from "@/lib/auth/profileImage";

export default function ProtectedNavbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(Logout());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo width={90} height={90} />
          </Link>
        </div>

        {/* Action Buttons & Links aligned to the right */}
        <div className="flex items-center gap-6">
          {/* Navigation Links near profile */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              {/* User Name and Email intentionally hidden as requested */}
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
                  <DropdownMenuItem><Link href="/">Home</Link></DropdownMenuItem>
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
              className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-all shadow-md shadow-purple-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
