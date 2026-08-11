"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useGetLandingStatsQuery,
  useGetPaginatedCoursesQuery,
} from "@/lib/redux/features/course/courseApi";
import { useGetAboutSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const useCountUp = (targetValue: number, shouldStart: boolean, duration = 1400): number => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const safeTarget = Number.isFinite(targetValue) ? Math.max(0, targetValue) : 0;

    if (safeTarget === 0) {
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
  const { data: settings } = useGetAboutSettingsQuery();
  const impactMetricsSettings = settings?.impactMetrics;
  const isVisible = settings?.sectionVisibility?.impactMetrics !== false && impactMetricsSettings?.enabled !== false;

  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { data: landingStats } = useGetLandingStatsQuery();
  const { data: paginatedCourses } = useGetPaginatedCoursesQuery({ page: 1, limit: 1 });

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

  const studentsTarget = landingStats?.studentsGlobally ?? 0;
  const coursesTarget = paginatedCourses?.pagination.totalCourses ?? 0;
  const ratingTarget = landingStats?.satisfactionRate ?? 0;

  const studentsValue = useCountUp(studentsTarget, hasEnteredView);
  const coursesValue = useCountUp(coursesTarget, hasEnteredView);
  const ratingValue = useCountUp(ratingTarget, hasEnteredView);

  const stats = useMemo(
    () => [
      { label: "Students", value: formatStudents(studentsValue) },
      { label: "Courses Created", value: formatCount(coursesValue) },
      { label: "Rating", value: formatRating(ratingValue) },
    ],
    [studentsValue, coursesValue, ratingValue],
  );

  return (
    <section ref={sectionRef} id="numbers" className="py-20">
      <div className="mx-auto w-full max-w-[120rem] px-6 lg:px-12 xl:px-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            By the Numbers
          </h2>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Our Footprint on the Global Stage
          </p>
        </div>
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
      </div>
    </section>
  );
};

export default Stats;