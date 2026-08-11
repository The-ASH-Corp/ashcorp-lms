"use client";

import React from "react";
import { Lightbulb, Share2, ShieldCheck, Users, Zap, Diamond } from "lucide-react";
import { useGetAboutSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const iconMap = [Lightbulb, ShieldCheck, Users, Share2, Zap, Diamond];

const Pillars = () => {
  const { data: settings } = useGetAboutSettingsQuery();
  const coreValuesSettings = settings?.coreValues;
  const isVisible = settings?.sectionVisibility?.coreValues !== false && coreValuesSettings?.enabled !== false;

  if (!isVisible) {
    return null;
  }

  const items = coreValuesSettings?.items || [
    {
      id: "cv-1",
      title: "Innovation",
      description:
        "We constantly evolve our courses and platform, blending modern teaching methods with practical, real-world skills learners can actually use.",
    },
    {
      id: "cv-2",
      title: "Integrity",
      description:
        "We're honest about what our courses deliver — no filler, no false promises. Just clear, quality content that respects your time and trust.",
    },
    {
      id: "cv-3",
      title: "Community",
      description:
        "We're building a growing network of learners, mentors, and industry experts who support each other's growth, long after a course ends.",
    },
    {
      id: "cv-4",
      title: "Excellence",
      description:
        "We hold every course to a high standard — because 'good enough' isn't good enough when it comes to your career and your goals.",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-[120rem] px-6 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {coreValuesSettings?.title || "The Pillars of ASH Academy"}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {coreValuesSettings?.subtitle ||
              "These aren't just values on a page they're the foundation behind every course we build and every learner we support."}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((pillar, idx) => {
            const IconComponent = iconMap[idx % iconMap.length];
            return (
              <div
                key={pillar.id || pillar.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <IconComponent className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pillars;