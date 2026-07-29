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
} from "lucide-react";
import Link from "next/link";

/* ─── short nav labels (sidebar) ─────────────────────────────────── */
const navItems = [
  { id: 1, label: "Information We Collect" },
  { id: 2, label: "How We Use Info" },
  { id: 3, label: "Cookies & Tracking" },
  { id: 4, label: "How We Share" },
  { id: 5, label: "Data Retention" },
  { id: 6, label: "Data Security" },
  { id: 7, label: "Your Rights" },
  { id: 8, label: "Children's Privacy" },
  { id: 9, label: "Third-Party Links" },
  { id: 10, label: "Data Transfers" },
  { id: 11, label: "Policy Changes" },
  { id: 12, label: "Contact Us" },
];

/* ─── shared row component (table-style) ─────────────────────────── */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border py-4 last:border-0">
    <span className="text-sm text-foreground">{label}</span>
    <span className="text-sm text-muted-foreground">{value}</span>
  </div>
);

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

/* ─── section card wrapper ────────────────────────────────────────── */
const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card px-6 py-2">{children}</div>
);

/* ─── prose paragraph ─────────────────────────────────────────────── */
const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
);

/* ─────────────────────────────────────────────────────────────────── */

const PrivacyPolicy = () => {
  const [activeId, setActiveId] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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
  }, []);

  const scrollTo = (id: number) => {
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-72 w-[40rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Ash Academy &bull; Privacy &amp; Information
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Your privacy matters to us. This Privacy Policy explains how ASH Academy LMS collects,
            uses, and protects your personal information when you use our platform.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Last updated:{" "}
            <span className="font-medium text-foreground">July 29, 2026</span>
          </p>
        </div>
      </section>

      {/* ── Two-column layout: Sidebar + Content ──────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex gap-8 lg:gap-12">

          {/* ── Sticky sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Navigation
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                      activeId === item.id
                        ? "bg-primary/10 text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`w-5 flex-shrink-0 text-[11px] font-semibold tabular-nums ${
                        activeId === item.id ? "text-primary" : "text-muted-foreground/60"
                      }`}
                    >
                      {String(item.id).padStart(2, "0")}
                    </span>
                    <span className="text-xs leading-snug">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Scrollable content ──────────────────────────────────────── */}
          <main className="min-w-0 flex-1 space-y-14">

            {/* 1. Information We Collect */}
            <section
              id="section-1"
              data-section="1"
              ref={(el) => { sectionRefs.current[0] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={1} icon={<Info className="h-6 w-6" />} title="Information We Collect" />
              <Prose>We collect the following types of information when you use ASH Academy LMS:</Prose>
              <SectionCard>
                <InfoRow label="Account Information" value="Name, email address, password, profile picture" />
                <InfoRow label="Payment Information" value="Billing address, transaction history (via third-party payment providers)" />
                <InfoRow label="Usage Data" value="Courses viewed, progress, quiz results, time spent on lessons" />
                <InfoRow label="Device Information" value="IP address, browser type, device type, operating system" />
                <InfoRow label="Communications" value="Support requests, feedback, survey responses" />
              </SectionCard>
            </section>

            {/* 2. How We Use Your Information */}
            <section
              id="section-2"
              data-section="2"
              ref={(el) => { sectionRefs.current[1] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={2} icon={<Settings className="h-6 w-6" />} title="How We Use Your Information" />
              <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                {[
                  "To create and manage your account",
                  "To provide access to purchased courses and track your learning progress",
                  "To process payments and send purchase confirmations",
                  "To send important updates, certificates, and customer support responses",
                  "To improve our platform, courses, and user experience",
                  "To send marketing communications, where you have opted in (you can unsubscribe anytime)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Cookies & Tracking */}
            <section
              id="section-3"
              data-section="3"
              ref={(el) => { sectionRefs.current[2] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={3} icon={<Cookie className="h-6 w-6" />} title="Cookies & Tracking Technologies" />
              <Prose>
                We use cookies and similar technologies to keep you logged in, remember your preferences,
                and understand how you use the Platform. You can control cookie preferences through your
                browser settings.
              </Prose>
            </section>

            {/* 4. How We Share Your Information */}
            <section
              id="section-4"
              data-section="4"
              ref={(el) => { sectionRefs.current[3] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={4} icon={<Share2 className="h-6 w-6" />} title="How We Share Your Information" />
              <Prose>We do not sell your personal information. We may share your data with:</Prose>
              <SectionCard>
                <InfoRow
                  label="Service Providers"
                  value="Payment processors, hosting providers, and email/communication tools who help us operate the Platform"
                />
                <InfoRow
                  label="Instructors"
                  value="Limited data (e.g. name, progress) may be shared with course instructors to support your learning"
                />
                <InfoRow
                  label="Legal Authorities"
                  value="Where required by law, regulation, or legal process"
                />
              </SectionCard>
            </section>

            {/* 5. Data Retention */}
            <section
              id="section-5"
              data-section="5"
              ref={(el) => { sectionRefs.current[4] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={5} icon={<Database className="h-6 w-6" />} title="Data Retention" />
              <Prose>
                We retain your personal information for as long as your account is active or as needed
                to provide you with lifetime course access. You may request deletion of your account and
                associated data at any time, subject to legal or contractual retention requirements.
              </Prose>
            </section>

            {/* 6. Data Security */}
            <section
              id="section-6"
              data-section="6"
              ref={(el) => { sectionRefs.current[5] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={6} icon={<Lock className="h-6 w-6" />} title="Data Security" />
              <Prose>
                We implement industry-standard security measures, including encryption and secure servers,
                to protect your personal information. However, no method of transmission over the internet
                is 100% secure, and we cannot guarantee absolute security.
              </Prose>
            </section>

            {/* 7. Your Rights */}
            <section
              id="section-7"
              data-section="7"
              ref={(el) => { sectionRefs.current[6] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={7} icon={<UserCheck className="h-6 w-6" />} title="Your Rights" />
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Depending on your location, you may have the right to:
              </p>
              <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                {[
                  "Access the personal data we hold about you",
                  "Request correction of inaccurate data",
                  "Request deletion of your data",
                  "Object to or restrict certain data processing",
                  "Withdraw consent for marketing communications at any time",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                To exercise any of these rights, contact us via our{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  Contact Us
                </Link>{" "}
                page.
              </p>
            </section>

            {/* 8. Children's Privacy */}
            <section
              id="section-8"
              data-section="8"
              ref={(el) => { sectionRefs.current[7] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={8} icon={<Baby className="h-6 w-6" />} title="Children's Privacy" />
              <Prose>
                ASH Academy LMS is not intended for children under 16. We do not knowingly collect
                personal information from children under this age without parental consent.
              </Prose>
            </section>

            {/* 9. Third-Party Links */}
            <section
              id="section-9"
              data-section="9"
              ref={(el) => { sectionRefs.current[8] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={9} icon={<Link2 className="h-6 w-6" />} title="Third-Party Links" />
              <Prose>
                Our Platform may contain links to third-party websites or services. We are not responsible
                for the privacy practices of these third parties, and we encourage you to review their
                privacy policies.
              </Prose>
            </section>

            {/* 10. International Data Transfers */}
            <section
              id="section-10"
              data-section="10"
              ref={(el) => { sectionRefs.current[9] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={10} icon={<Globe className="h-6 w-6" />} title="International Data Transfers" />
              <Prose>
                Your information may be transferred to and processed in countries other than your own.
                We take steps to ensure your data is protected in accordance with this Privacy Policy
                wherever it is processed.
              </Prose>
            </section>

            {/* 11. Changes to This Policy */}
            <section
              id="section-11"
              data-section="11"
              ref={(el) => { sectionRefs.current[10] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={11} icon={<RefreshCw className="h-6 w-6" />} title="Changes to This Policy" />
              <Prose>
                We may update this Privacy Policy from time to time. We will notify you of significant
                changes by posting the updated policy on this page with a revised &quot;Last updated&quot; date.
              </Prose>
            </section>

            {/* 12. Contact Us */}
            <section
              id="section-12"
              data-section="12"
              ref={(el) => { sectionRefs.current[11] = el; }}
              className="scroll-mt-28"
            >
              <SectionHeading id={12} icon={<Mail className="h-6 w-6" />} title="Contact Us" />
              <Prose>
                If you have questions about this Privacy Policy or how we handle your data, please reach
                out via our{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  Contact Us
                </Link>{" "}
                page.
              </Prose>
            </section>

            {/* ── Still have questions CTA ──────────────────────────────── */}
            <section className="rounded-2xl border border-border bg-secondary/30 p-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Still have questions?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Our support team is happy to help clarify any part of this policy or address your
                privacy concerns. Reach out anytime — we typically respond within one business day.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary/50"
                >
                  Learn More About Us
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
