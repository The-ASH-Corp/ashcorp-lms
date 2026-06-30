"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Paintbrush, Code, Play, PenTool, Rocket, ArrowRight } from "lucide-react";

export default function ExploreCategories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-indigo-950">
              Explore Categories
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Hand-picked creative pathways just for you.
            </p>
          </div>
          <Link
            href="#"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-purple-700 transition-colors"
          >
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Digital Illustration (Spans 2 rows on desktop) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-8 lg:row-span-2 flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-md transition-shadow group">
            {/* Top Icon */}
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Paintbrush className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-indigo-950">
                Digital Illustration
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-[240px]">
                Character design, environment art, and vector magic.
              </p>
            </div>

            {/* Bottom count */}
            <div className="z-10">
              <span className="inline-block rounded-full bg-white/80 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-indigo-950">
                12 Courses
              </span>
            </div>

            {/* Brush background graphic decorator */}
            <div className="absolute -bottom-10 -right-10 text-blue-200/50 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <svg
                width="220"
                height="220"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M18 21a6 6 0 0 0-1.2-3.6L12 12l-4.8 5.4A6 6 0 0 0 6 21h12Z" />
                <path d="M12 12V3a1 1 0 0 0-2 0v9a1 1 0 0 0 2 0Z" />
              </svg>
            </div>
          </div>

          {/* Card 2: Creative UI */}
          <div className="rounded-3xl bg-purple-50 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-xs">
                <Code className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-indigo-950">
                Creative UI
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Design apps people love.
              </p>
            </div>
          </div>

          {/* Card 3: Motion */}
          <div className="rounded-3xl bg-gray-50 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-xs">
                <Play className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-indigo-950">Motion</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bring layouts to life.
              </p>
            </div>
          </div>

          {/* Card 4: Creative Writing (Spans 2 columns on desktop) */}
          <div className="relative overflow-hidden rounded-3xl bg-purple-50/50 p-8 lg:col-span-2 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-md transition-shadow group">
            {/* Top icon and title */}
            <div className="max-w-[60%]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs">
                <PenTool className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-indigo-950">
                Creative Writing
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                The art of narrative.
              </p>
            </div>

            {/* Rocket badge top-right */}
            <div className="absolute top-6 right-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-md shadow-purple-200">
                <Rocket className="h-4 w-4" />
              </div>
            </div>

            {/* Pen Image on the right */}
            <div className="absolute right-0 bottom-0 h-full w-[40%] pointer-events-none">
              <Image
                src="/writing_pen.png"
                alt="Fountain Pen"
                fill
                className="object-contain object-right-bottom group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
