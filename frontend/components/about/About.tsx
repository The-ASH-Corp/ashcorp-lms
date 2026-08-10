"use client";

import React from "react";
import Image from "next/image";
import { useGetAboutSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const About = () => {
  const { data: settings } = useGetAboutSettingsQuery();
  const philosophySettings = settings?.philosophy;
  const isVisible = settings?.sectionVisibility?.philosophy !== false && philosophySettings?.enabled !== false;

  if (!isVisible) {
    return null;
  }

  const imageSrc = philosophySettings?.image || "/images/campus.png";

  return (
    <section id="about" className="bg-secondary py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border shadow-sm aspect-4/3 relative">
          {imageSrc.startsWith("data:") || imageSrc.startsWith("http") ? (
            /* eslint-disable-next-html-element-for-img */
            <img
              src={imageSrc}
              alt={philosophySettings?.sectionHeading || "Educational Philosophy"}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={imageSrc}
              alt={philosophySettings?.sectionHeading || "Educational Philosophy"}
              width={720}
              height={560}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {philosophySettings?.sectionHeading || "Built for Learners, Not Just Learning"}
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
            {philosophySettings?.philosophyContent ||
              "ASH Academy LMS started with a simple observation, most online courses are built for content, not for people. We set out to change that designing a platform where every course is crafted with care, every lesson respects your time and every learner has the freedom to move at their own pace."}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
