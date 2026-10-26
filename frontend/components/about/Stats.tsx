"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useGetLandingStatsQuery,
  useGetPaginatedCoursesQuery,
} from "@/lib/redux/features/course/courseApi";
import { useGetAboutSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { Skeleton } from "@/components/ui/skeleton";

const useCountUp = (targetValue: number, shouldStart: boolean, duration = 1400): number => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const safeTarget = Number.isFinite(targetValue) ? Math.max(0, targetValue) : 0;

    if (safeTarget === 0) {
      setDisplayValue(0);
      return;
    }

    let animationFrameId = 0;
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(safeTarget * eased);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, shouldStart, duration]);

  return displayValue;
};

const formatStudents = (value: number): string => {
  if (value >= 1000) {
    const inThousands = value / 1000;
    const formatted = inThousands % 1 === 0 ? inThousands.toFixed(0) : inThousands.toFixed(1);
    return `${formatted}k+`;
  }

  return `${Math.round(value)}+`;
};

const formatCount = (value: number): string => `${Math.round(value)}+`;

const formatRating = (value: number): string => {
  const clamped = Math.max(0, Math.min(5, value));
  return `${clamped.toFixed(1)}/5`;
};

const Stats = () => {
  const { data: settings, isLoading: isAboutSettingsLoading } = useGetAboutSettingsQuery();
  const impactMetricsSettings = settings?.impactMetrics;
  const isVisible = settings?.sectionVisibility?.impactMetrics !== false && impactMetricsSettings?.enabled !== false;

  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { data: landingStats, isLoading: isLandingStatsLoading } = useGetLandingStatsQuery();
  const { data: paginatedCourses, isLoading: isCoursesLoading } = useGetPaginatedCoursesQuery({ page: 1, limit: 1 });

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || hasEnteredView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasEnteredView]);

  if (!isVisible) {
    return null;
  }

  // Check if admin chose custom frontend data or live DB data
  const isFrontendMode =
    impactMetricsSettings?.source === "frontend" ||
    impactMetricsSettings?.source === "manual";

  const isLoading =
    isAboutSettingsLoading ||
    (!isFrontendMode && (isLandingStatsLoading || isCoursesLoading));

  // Data selection based on admin settings
  const studentsTarget = isFrontendMode
    ? (impactMetricsSettings?.studentsCount ?? 26)
    : (landingStats?.studentsGlobally ?? 0);

  const coursesTarget = isFrontendMode
    ? (impactMetricsSettings?.coursesCount ?? 7)
    : (paginatedCourses?.pagination.totalCourses ?? 0);

  const ratingTarget = isFrontendMode
    ? (impactMetricsSettings?.rating ?? 0.0)
    : (landingStats?.satisfactionRate ?? 0);

  const studentsValue = useCountUp(studentsTarget, hasEnteredView);
  const coursesValue = useCountUp(coursesTarget, hasEnteredView);
  const ratingValue = useCountUp(ratingTarget, hasEnteredView);

  const sectionTitle = impactMetricsSettings?.title || "By the Numbers";
  const sectionSubtitle = impactMetricsSettings?.subtitle || "Our Footprint on the Global Stage";

  const studentsLabel = isFrontendMode && impactMetricsSettings?.studentsLabel
    ? impactMetricsSettings.studentsLabel
    : "Students";

  const coursesLabel = isFrontendMode && impactMetricsSettings?.coursesLabel
    ? impactMetricsSettings.coursesLabel
    : "Courses Created";

  const ratingLabel = isFrontendMode && impactMetricsSettings?.ratingLabel
    ? impactMetricsSettings.ratingLabel
    : "Rating";

  const stats = useMemo(
    () => [
      { label: studentsLabel, value: formatStudents(studentsValue) },
      { label: coursesLabel, value: formatCount(coursesValue) },
      { label: ratingLabel, value: formatRating(ratingValue) },
    ],
    [studentsValue, coursesValue, ratingValue, studentsLabel, coursesLabel, ratingLabel],
  );

  return (
    <section ref={sectionRef} id="numbers" className="py-20">
      <div className="mx-auto w-full max-w-[120rem] px-6 lg:px-12 xl:px-20">
        <div className="text-center">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 sm:h-10 w-64 mx-auto rounded-xl bg-muted" />
              <Skeleton className="h-3.5 w-72 mx-auto rounded bg-muted" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {sectionTitle}
              </h2>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {sectionSubtitle}
              </p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="mt-14 grid gap-10 text-center sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-12 sm:h-14 w-28 rounded-xl bg-muted" />
                <Skeleton className="mt-3 h-3.5 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-10 text-center sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;