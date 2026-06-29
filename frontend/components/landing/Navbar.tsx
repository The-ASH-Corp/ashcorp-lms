"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

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
          <nav className="hidden md:flex items-center gap-6">
            <Tabs defaultValue="Categories">
              <TabsList variant={"line"} className="">
                <TabsTrigger value="Categories" >
                  <NativeSelect className="w-[115px] border-0 border-none bg-transparent text-gray-600 data-[state=active]:text-violet-600">
                    <NativeSelectOption value="Categories">
                      Categories
                    </NativeSelectOption>
                    <NativeSelectOption value="Categories">
                      Digital Illustration
                    </NativeSelectOption>
                    <NativeSelectOption value="Courses">
                      Creative UI
                    </NativeSelectOption>
                    <NativeSelectOption value="About Us">
                      Motion Design
                    </NativeSelectOption>
                    <NativeSelectOption value="Contact Us">
                      Creative Writing
                    </NativeSelectOption>
                  </NativeSelect>
                </TabsTrigger>
                <TabsTrigger value="Courses" className="text-gray-600 data-[state=active]:text-violet-600"><Link href="/courses">Courses</Link></TabsTrigger>
                <TabsTrigger value="About Us" className="text-gray-600 data-[state=active]:text-violet-600"><Link href="/about">About Us</Link></TabsTrigger>
                <TabsTrigger value="Contact Us" className="text-gray-600 data-[state=active]:text-violet-600"><Link href="/contact">Contact Us</Link></TabsTrigger>
              </TabsList>
            </Tabs>
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
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                  <DropdownMenuSeparator /> 
                  <DropdownMenuItem onClick={() => dispatch(logout())}>
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
