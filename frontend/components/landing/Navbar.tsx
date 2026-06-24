"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-950">
              Ash <span className="text-purple-600">Academy</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-purple-600 transition-colors hover:text-purple-800">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 hidden w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 group-hover:block">
                <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">Digital Illustration</Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">Creative UI</Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">Motion Design</Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">Creative Writing</Link>
              </div>
            </div>
            <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-purple-700">
              Courses
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-purple-700">
              Mentors
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-purple-700">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-700"
          >
            Login
          </Link>
          <Link
            href="#"
            className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-all shadow-md shadow-purple-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300"
          >
            Join for free
          </Link>
        </div>
      </div>
    </header>
  );
}
