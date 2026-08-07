"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Info,
  Settings,
  Cookie,
  Share2,
  Database,
  Lock,
  UserCheck,
  Baby,
  Link2,
  Globe,
  RefreshCw,
  Mail,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useGetPrivacyPolicySettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

/* ─── icon map for section numbers ─────────────────────────────────── */
const sectionIcons: Record<number, React.ReactNode> = {
  1: <Info className="h-6 w-6" />,
  2: <Settings className="h-6 w-6" />,
  3: <Cookie className="h-6 w-6" />,
  4: <Share2 className="h-6 w-6" />,
  5: <Database className="h-6 w-6" />,
  6: <Lock className="h-6 w-6" />,
  7: <UserCheck className="h-6 w-6" />,
  8: <Baby className="h-6 w-6" />,
  9: <Link2 className="h-6 w-6" />,
  10: <Globe className="h-6 w-6" />,
  11: <RefreshCw className="h-6 w-6" />,
  12: <Mail className="h-6 w-6" />,
};

/* ─── section heading ─────────────────────────────────────────────── */
const SectionHeading = ({
  id,
  icon,
  title,
}: {
  id: number;
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="mb-6 flex items-center gap-4">
    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
      {icon}
    </span>
    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      {id}. {title}
    </h2>
  </div>
);

/* ─── prose paragraph ─────────────────────────────────────────────── */
const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{children}</p>
);

/* ─────────────────────────────────────────────────────────────────── */

const PrivacyPolicy = () => {
  const { data: settings } = useGetPrivacyPolicySettingsQuery();
  const [activeId, setActiveId] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const heroSettings = settings?.hero;
  const policySections = settings?.policySections;
  const supportCta = settings?.supportCta;

  const isHeroVisible = settings?.sectionVisibility?.hero !== false;
  const isPolicySectionsVisible =
    settings?.sectionVisibility?.policySections !== false;
  const isSupportCtaVisible =
    settings?.sectionVisibility?.supportCta !== false;

  const sectionItems = policySections?.items || [];

  /* track which section is in view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-section"));
            setActiveId(id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sectionItems.length]);

  const scrollTo = (id: number) => {
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      {isHeroVisible && (
        <section className="relative overflow-hidden py-16 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 right-0 h-72 w-[40rem] rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {heroSettings?.badgeText || "Ash Academy • Privacy & Information"}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {heroSettings?.headline || "Privacy Policy"}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground whitespace-pre-line">
              {heroSettings?.description ||
                "Your privacy matters to us. This Privacy Policy explains how ASH Academy LMS collects, uses, and protects your personal information when you use our platform."}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Last updated:{" "}
              <span className="font-medium text-foreground">
                {heroSettings?.lastUpdatedDate || "July 29, 2026"}
              </span>
            </p>
          </div>
        </section>
      )}

      {/* ── Two-column layout: Sidebar + Content ──────────────────────── */}
      {isPolicySectionsVisible && sectionItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-24">
          <div className="flex gap-8 lg:gap-12">
            {/* ── Sticky sidebar ──────────────────────────────────────────── */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Navigation
                </p>
                <nav className="space-y-1">
                  {sectionItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.sectionNumber)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                        activeId === item.sectionNumber
                          ? "bg-primary/10 text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`w-5 flex-shrink-0 text-[11px] font-semibold tabular-nums ${
                          activeId === item.sectionNumber
                            ? "text-primary"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {String(item.sectionNumber).padStart(2, "0")}
                      </span>
                      <span className="text-xs leading-snug">{item.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Scrollable content ──────────────────────────────────────── */}
            <main className="min-w-0 flex-1 space-y-14">
              {sectionItems.map((item, idx) => (
                <section
                  key={item.id}
                  id={`section-${item.sectionNumber}`}
                  data-section={item.sectionNumber}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  className="scroll-mt-28"
                >
                  <SectionHeading
                    id={item.sectionNumber}
                    icon={
                      sectionIcons[item.sectionNumber] || (
                        <FileText className="h-6 w-6" />
                      )
                    }
                    title={item.title}
                  />
                  <Prose>{item.content}</Prose>
                </section>
              ))}

              {/* ── Still have questions CTA ──────────────────────────────── */}
              {isSupportCtaVisible && (
                <section className="rounded-2xl border border-border bg-secondary/30 p-10 text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {supportCta?.title || "Still have questions?"}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {supportCta?.description ||
                      "Our support team is happy to help clarify any part of this policy or address your privacy concerns. Reach out anytime — we typically respond within one business day."}
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300"
                    >
                      <Mail className="h-4 w-4" />
                      {supportCta?.buttonText || "Contact Support"}
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary/50"
                    >
                      Learn More About Us
                    </Link>
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicy;
