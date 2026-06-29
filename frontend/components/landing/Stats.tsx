"use client";

import React from "react";

export default function Stats() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="rounded-3xl bg-purple-600 px-6 py-12 text-white shadow-xl shadow-purple-100 sm:px-12 md:py-16">
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-y-0 md:divide-x md:divide-purple-500/40">
            {/* Stat 1 */}
            <div className="text-center md:px-4">
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">50k+</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                Students Globally
              </p>
            </div>

            {/* Stat 2 */}
            <div className="text-center md:px-4">
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">120+</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                Expert Mentors
              </p>
            </div>

            {/* Stat 3 */}
            <div className="text-center md:px-4">
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">4.9/5</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
