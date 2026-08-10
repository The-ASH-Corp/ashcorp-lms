"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Users,
  UserCheck,
  BookOpen,
  CreditCard,
  Shield,
  Award,
  AlertTriangle,
  Globe,
  Ban,
  Scale,
  RefreshCw,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useGetTermsConditionsSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

/* ─── icon map for section numbers ─────────────────────────────────── */
const sectionIcons: Record<number, React.ReactNode> = {
  1: <FileText className="h-6 w-6" />,
  2: <Users className="h-6 w-6" />,
  3: <UserCheck className="h-6 w-6" />,
  4: <BookOpen className="h-6 w-6" />,
  5: <CreditCard className="h-6 w-6" />,
  6: <Shield className="h-6 w-6" />,
  7: <Award className="h-6 w-6" />,
  8: <AlertTriangle className="h-6 w-6" />,
  9: <Globe className="h-6 w-6" />,
  10: <Ban className="h-6 w-6" />,
  11: <Scale className="h-6 w-6" />,
  12: <RefreshCw className="h-6 w-6" />,
  13: <Mail className="h-6 w-6" />,
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
  <div className="mb-5 flex items-center gap-4">
    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
      {icon}
    </span>
    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      {id}. {title}
    </h2>
  </div>
);

/* ─── content block renderer ───────────────────────────────────────── */
const FormattedContent = ({ content }: { content: string }) => {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks: { type: "text" | "bullet"; items: string[] }[] = [];

  let currentBullets: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      currentBullets.push(trimmed.replace(/^[-•]\s*/, ""));
    } else {
      if (currentBullets.length > 0) {
        blocks.push({ type: "bullet", items: [...currentBullets] });
        currentBullets = [];
      }
      if (trimmed) {
        blocks.push({ type: "text", items: [trimmed] });
      }
    }
  });

  if (currentBullets.length > 0) {
    blocks.push({ type: "bullet", items: currentBullets });
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        if (block.type === "bullet") {
          return (
            <ul key={idx} className="my-3 space-y-2 text-sm text-muted-foreground">
              {block.items.map((item, itemIdx) => {
                const parts = item.split(":");
                const hasLabel = parts.length > 1;
                return (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>
                      {hasLabel ? (
                        <>
                          <strong className="font-semibold text-foreground">{parts[0]}:</strong>
                          {parts.slice(1).join(":")}
                        </>
                      ) : (
                        item
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }
        return (
          <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
            {block.items[0]}
          </p>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────── */

const TermsConditions = () => {
  const { data: settings } = useGetTermsConditionsSettingsQuery();
  const [activeId, setActiveId] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const heroSettings = settings?.hero;
  const termsSections = settings?.termsSections;

  const isHeroVisible = settings?.sectionVisibility?.hero !== false;
  const isTermsSectionsVisible =
    settings?.sectionVisibility?.termsSections !== false;

  const sectionItems = termsSections?.items || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(Number(entry.target.getAttribute("data-section")));
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sectionItems.length]);

  const scrollTo = (id: number) =>
    document
      .getElementById(`tc-section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      {isHeroVisible && (
        <section className="relative overflow-hidden py-16 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-0 h-72 w-[40rem] rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {heroSettings?.badgeText || "Legal Framework"}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {heroSettings?.headline || "Terms & Conditions"}
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Last Updated: {heroSettings?.lastUpdatedDate || "29 July 2026"}
            </div>
            <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground whitespace-pre-line">
              {heroSettings?.description ||
                "Welcome to ASH Academy LMS. These Terms & Conditions govern your access to and use of our website, Learning Management System (LMS), and online courses."}
            </p>
          </div>
        </section>
      )}

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      {isTermsSectionsVisible && sectionItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-24">
          <div className="flex gap-8 lg:gap-12">
            {/* ── Sticky sidebar ──────────────────────────────────────────── */}
            <aside className="hidden lg:block w-52 flex-shrink-0">
              <div className="sticky top-24">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  On This Page
                </p>
                <nav className="space-y-0.5">
                  {sectionItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.sectionNumber)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                        activeId === item.sectionNumber
                          ? "bg-primary/10 font-semibold text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`w-5 flex-shrink-0 text-[11px] font-bold tabular-nums ${
                          activeId === item.sectionNumber
                            ? "text-primary"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {String(item.sectionNumber).padStart(2, "0")}
                      </span>
                      <span className="text-xs leading-snug">{item.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick links */}
                <div className="mt-6 space-y-2 border-t border-border pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Quick Links
                  </p>
                  <Link
                    href="/privacy-policy"
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Privacy Policy
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact Legal
                  </Link>
                </div>
              </div>
            </aside>

            {/* ── Scrollable main content ──────────────────────────────────── */}
            <main className="min-w-0 flex-1 space-y-14">
              {sectionItems.map((item, idx) => (
                <section
                  key={item.id}
                  id={`tc-section-${item.sectionNumber}`}
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
                  <FormattedContent content={item.content} />
                </section>
              ))}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsConditions;
