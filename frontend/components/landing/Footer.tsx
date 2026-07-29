"use client";

import React from "react";
import Link from "next/link";
import { Share2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-purple-100 pt-16 pb-8">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-indigo-950">
              Ash <span className="text-primary">Academy</span>
            </span>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              Making creative education accessible, fun, and results-driven for
              learners everywhere.
            </p>
            {/* Social / Utility Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 border border-purple-50 hover:text-purple-600 transition-colors shadow-xs">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 border border-purple-50 hover:text-red-500 transition-colors shadow-xs">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Links: Academy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Academy
            </h4>
            <ul className="mt-4 space-y-2">
              {["About", "Courses", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
                ),
              )}
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "#" },
                { label: "Help Center", href: "#" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Stay Inspired */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Stay Inspired
            </h4>
            <p className="mt-4 text-xs text-gray-500">
              Get weekly creative prompts and course discounts.
            </p>
            <form className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="rounded-full border border-purple-100 bg-white px-4 py-2.5 text-xs text-indigo-950 placeholder-gray-400 outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-purple-700 active:scale-98"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright/meta info */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-purple-100/50 pt-8 gap-4 sm:flex-row">
          <p className="text-[10px] text-gray-400">
            © 2026 Ash Academy. Empowering learners worldwide.
          </p>
          <p className="text-[10px] text-gray-400">
            Designed for Students | Secure Payments
          </p>
        </div>
      </div>
    </footer>
  );
}
