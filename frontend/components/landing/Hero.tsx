"use client";

import React from "react";
import { Search, Sparkles, Paintbrush } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF] via-[#F5F3FF] to-white py-20 lg:py-28">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />

      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-purple-600/10 mb-8 animate-bounce [animation-duration:2s]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>New: Creative Illustration Masterclass</span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl/tight">
          Master the Art of{" "}
          <span className="relative inline-block px-1 font-serif italic text-primary underline decoration-purple-300 decoration-wavy decoration-3">
            Creative Learning
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-gray-500 sm:text-lg">
          Join 50k+ students building the future through design, code, and
          digital art.
          <br className="hidden sm:inline" /> Playful, structured, and
          community-driven.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="relative flex items-center rounded-full bg-white p-2 shadow-xl shadow-purple-100/50 border border-purple-100 transition-all focus-within:ring-2 focus-within:ring-purple-500/20">
            <Search className="ml-3 h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              className="w-full bg-transparent px-3 py-3 text-sm text-indigo-950 placeholder-gray-400 outline-none"
            />
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-95 shrink-0">
              Search
            </button>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute right-[12%] top-[60%] hidden lg:block animate-bounce [animation-duration:4s]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-primary ring-1 ring-purple-100">
            <Paintbrush className="h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
