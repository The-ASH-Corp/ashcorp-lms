"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetLandingStatsQuery } from "@/lib/redux/features/course/courseApi";

const useCountUp = (
  targetValue: number,
  shouldStart: boolean,
  duration = 1400,
): number => {
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

const formatMentors = (value: number): string => `${Math.round(value)}+`;

const formatSatisfaction = (value: number): string => {
  const clamped = Math.max(0, Math.min(5, value));
  return `${clamped.toFixed(1)}/5`;
};

export default function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const { data } = useGetLandingStatsQuery();

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
      {
        threshold: 0.3,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasEnteredView]);

  const studentsTarget = data?.studentsGlobally ?? 0;
  const mentorsTarget = data?.expertMentors ?? 0;
  const satisfactionTarget = data?.satisfactionRate ?? 0;

  const studentsValue = useCountUp(studentsTarget, hasEnteredView);
  const mentorsValue = useCountUp(mentorsTarget, hasEnteredView);
  const satisfactionValue = useCountUp(satisfactionTarget, hasEnteredView);

  const renderedStats = useMemo(
    () => [
      {
        label: "Students Globally",
        value: formatStudents(studentsValue),
      },
      {
        label: "Expert Mentors",
        value: formatMentors(mentorsValue),
      },
      {
        label: "Satisfaction Rate",
        value: formatSatisfaction(satisfactionValue),
      },
    ],
    [studentsValue, mentorsValue, satisfactionValue],
  );

  return (
    <section ref={sectionRef} className="bg-white py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="rounded-[2rem] bg-primary px-6 py-10 text-white shadow-xl shadow-purple-100 sm:px-12 md:py-14">
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-y-0 md:divide-x md:divide-purple-500/40">
            {renderedStats.map((item) => (
              <div key={item.label} className="text-center md:px-4">
                <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">{item.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
