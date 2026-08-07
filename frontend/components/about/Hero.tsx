"use client";

import React from "react";
import { useGetAboutSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const Hero = () => {
  const { data: settings } = useGetAboutSettingsQuery();
  const heroSettings = settings?.hero;
  const isVisible = settings?.sectionVisibility?.hero !== false && heroSettings?.enabled !== false;

  if (!isVisible) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          OUR STORY
        </p>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          {heroSettings?.mainHeadline || "Learn Anywhere Grow Everywhere"}
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-muted-foreground whitespace-pre-line">
          {heroSettings?.bodyNarrative ||
            "ASH Academy LMS was built on one idea: great learning shouldn't be limited by time, place, or pace. Through expertly crafted courses, self-paced flexibility, and lifetime access, we help learners turn curiosity into capability - building real skills that open real doors, wherever they are in the world."}
        </p>
      </div>
    </section>
  );
};

export default Hero;
