"use client";

import React from "react";
import { useGetContactSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { Skeleton } from "@/components/ui/skeleton";

const Hero = () => {
  const { data: settings, isLoading } = useGetContactSettingsQuery();
  const heroSettings = settings?.hero;
  const isVisible = settings?.sectionVisibility?.hero !== false;

  if (!isVisible) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-18">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-72 w-160 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-[120rem] px-6 lg:px-12 xl:px-20">
        {isLoading ? (
          <Skeleton className="h-4 w-36 rounded-md bg-purple-200/50" />
        ) : (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {heroSettings?.badgeText || "Connect with Us"}
          </p>
        )}

        {isLoading ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 sm:h-12 w-3/4 max-w-2xl rounded-xl bg-purple-200/50" />
          </div>
        ) : (
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            {heroSettings?.headline || "Get in Touch with Academic Zenith"}
          </h1>
        )}

        {isLoading ? (
          <div className="mt-6 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full rounded-md bg-purple-200/40" />
            <Skeleton className="h-4 w-5/6 rounded-md bg-purple-200/40" />
            <Skeleton className="h-4 w-3/5 rounded-md bg-purple-200/40" />
          </div>
        ) : (
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground whitespace-pre-line">
            {heroSettings?.description ||
              "Whether you're a prospective student seeking guidance, a corporate entity looking for strategic partnerships, or a media representative, our specialized teams are ready to provide the professional support you deserve."}
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;