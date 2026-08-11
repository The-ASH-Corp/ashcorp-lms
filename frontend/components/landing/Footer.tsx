"use client";

import React from "react";
import Link from "next/link";
import { Share2, Heart } from "lucide-react";
import { useGetHomepageSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

export default function Footer() {
  const { data: settings } = useGetHomepageSettingsQuery();
  const footerSettings = settings?.footer;

  if (footerSettings?.enabled === false) {
    return null;
  }

  return (
    <footer className="border-t border-purple-100 bg-secondary pt-14 pb-8 sm:pt-16">
      <div className="mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-indigo-950">
              Ash <span className="text-primary">Academy</span>
            </span>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              {footerSettings?.brandDescription ||
                "Making creative education accessible, fun, and results-driven for learners everywhere."}
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
              ))}
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
                { label: "Terms of Service", href: "/terms-conditions" },
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-purple-100/50 pt-8 sm:flex-row">
          <p className="text-[10px] text-gray-400">
            {footerSettings?.copyrightText ||
              "© 2026 Ash Academy. Empowering learners worldwide."}
          </p>
          <p className="text-[10px] text-gray-400">
            Designed for Students | Secure Payments
          </p>
        </div>
      </div>
    </footer>
  );
}
