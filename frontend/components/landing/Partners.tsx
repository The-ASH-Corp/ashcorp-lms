"use client";

import React from "react";

const partners = [
  { name: "CREATIVO" },
  { name: "MUSE" },
  { name: "DRBBL" },
  { name: "CANVASE" },
  { name: "STUDIO_G" },
];

export default function Partners() {
  return (
    <section className="bg-white py-12 border-b border-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Our Graduates Work At
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20">
          {partners.map((partner) => (
            <span
              key={partner.name}
              className="text-xl md:text-2xl font-black italic tracking-wider text-gray-300 select-none hover:text-gray-400 transition-colors"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
