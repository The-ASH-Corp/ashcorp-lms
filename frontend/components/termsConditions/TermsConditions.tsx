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
  ExternalLink,
  Printer,
  Download,
} from "lucide-react";
import Link from "next/link";

/* ─── sidebar nav items ───────────────────────────────────────────── */
const navItems = [
  { id: 1,  label: "Acceptance" },
  { id: 2,  label: "Eligibility" },
  { id: 3,  label: "Account Registration" },
  { id: 4,  label: "Course Access" },
  { id: 5,  label: "Payments & Pricing" },
  { id: 6,  label: "Intellectual Property" },
  { id: 7,  label: "Certificates" },
  { id: 8,  label: "User Conduct" },
  { id: 9,  label: "Platform Availability" },
  { id: 10, label: "Suspension & Termination" },
  { id: 11, label: "Limitation of Liability" },
  { id: 12, label: "Changes to Terms" },
  { id: 13, label: "Contact Us" },
];

/* ─── helpers ─────────────────────────────────────────────────────── */
const SectionNumber = ({ n }: { n: number }) => (
  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
    {String(n).padStart(2, "0")}
  </span>
);

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

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 text-sm text-muted-foreground">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const InfoCard = ({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) => (
  <div className="rounded-lg border border-border bg-secondary/30 p-4">
    <div className="mb-2 flex items-center gap-2 text-primary">{icon}</div>
    <h4 className="mb-1 text-sm font-semibold text-foreground">{title}</h4>
    <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */

const TermsConditions = () => {
  const [activeId, setActiveId] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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
  }, []);

  const scrollTo = (id: number) =>
    document
      .getElementById(`tc-section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const setRef = (idx: number) => (el: HTMLElement | null) => {
    sectionRefs.current[idx] = el;
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-0 h-72 w-[40rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Legal Framework
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Last Updated: 29 July 2026
          </div>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Welcome to ASH Academy LMS. These Terms &amp; Conditions govern your access to and use
            of our website, Learning Management System (LMS), and online courses. By creating an
            account, enrolling in a course, or using our platform, you agree to these Terms &amp;
            Conditions. If you do not agree with any part of these terms, please refrain from using
            our services.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex gap-8 lg:gap-12">

          {/* ── Sticky sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                On This Page
              </p>
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                      activeId === item.id
                        ? "bg-primary/10 font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`w-5 flex-shrink-0 text-[11px] font-bold tabular-nums ${
                        activeId === item.id ? "text-primary" : "text-muted-foreground/50"
                      }`}
                    >
                      {String(item.id).padStart(2, "0")}
                    </span>
                    <span className="text-xs leading-snug">{item.label}</span>
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

            {/* 1. Acceptance of Terms */}
            <section
              id="tc-section-1"
              data-section="1"
              ref={setRef(0)}
              className="scroll-mt-28"
            >
              <SectionHeading id={1} icon={<FileText className="h-6 w-6" />} title="Acceptance of Terms" />
              <Prose>
                By accessing or using ASH Academy LMS, you agree to comply with these Terms &amp;
                Conditions, along with our Privacy Policy and any other policies published on our
                website.
              </Prose>
            </section>

            {/* 2. Eligibility */}
            <section
              id="tc-section-2"
              data-section="2"
              ref={setRef(1)}
              className="scroll-mt-28"
            >
              <SectionHeading id={2} icon={<Users className="h-6 w-6" />} title="Eligibility" />
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<UserCheck className="h-5 w-5" />}
                  title="Minimum Age"
                  body="You must be at least 16 years of age to create an account on ASH Academy LMS."
                />
                <InfoCard
                  icon={<Users className="h-5 w-5" />}
                  title="Under 18 Users"
                  body="If you are under 18, you confirm that you have permission from your parent or legal guardian to use our platform and enrol in our courses."
                />
              </div>
            </section>

            {/* 3. Account Registration */}
            <section
              id="tc-section-3"
              data-section="3"
              ref={setRef(2)}
              className="scroll-mt-28"
            >
              <SectionHeading id={3} icon={<UserCheck className="h-6 w-6" />} title="Account Registration" />
              <Prose>
                To access our courses, you must create an account using accurate and complete
                information. You are responsible for:
              </Prose>
              <div className="mt-4">
                <BulletList
                  items={[
                    "Keeping your login credentials secure.",
                    "Ensuring your account information remains accurate and up to date.",
                    "All activities carried out through your account.",
                    "Informing us immediately if you suspect any unauthorised access to your account.",
                  ]}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                ASH Academy LMS reserves the right to suspend or terminate accounts that contain
                false information or violate these Terms &amp; Conditions.
              </p>
            </section>

            {/* 4. Course Access & Lifetime Access */}
            <section
              id="tc-section-4"
              data-section="4"
              ref={setRef(3)}
              className="scroll-mt-28"
            >
              <SectionHeading id={4} icon={<BookOpen className="h-6 w-6" />} title="Course Access & Lifetime Access" />
              <div className="space-y-3">
                <BulletList
                  items={[
                    "After successful enrolment and payment, you will receive access to your purchased course through your ASH Academy LMS account.",
                    "Many of our courses include lifetime access, allowing you to learn at your own pace and revisit your lessons whenever you need.",
                    "Lifetime access means you can access your purchased course for as long as it remains available on ASH Academy LMS. We may update or improve course content from time to time to ensure it remains relevant and valuable.",
                    "Course access is provided for your personal learning only and must not be shared, transferred, resold, or used for commercial purposes.",
                  ]}
                />
              </div>
            </section>

            {/* 5. Payments & Pricing */}
            <section
              id="tc-section-5"
              data-section="5"
              ref={setRef(4)}
              className="scroll-mt-28"
            >
              <SectionHeading id={5} icon={<CreditCard className="h-6 w-6" />} title="Payments & Pricing" />
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Currency"
                  body="All course fees are listed in Indian Rupees (₹) unless otherwise stated. Full payment must be completed before course access is granted."
                />
                <InfoCard
                  icon={<RefreshCw className="h-5 w-5" />}
                  title="Pricing Changes"
                  body="Prices, offers, and discounts may change without prior notice."
                />
                <InfoCard
                  icon={<Shield className="h-5 w-5" />}
                  title="Secure Payments"
                  body="Payments are processed securely through trusted third-party payment providers."
                />
                <InfoCard
                  icon={<Ban className="h-5 w-5" />}
                  title="Data Storage"
                  body="ASH Academy LMS does not store your debit card, credit card, UPI, or banking details."
                />
              </div>
            </section>

            {/* 6. Intellectual Property */}
            <section
              id="tc-section-6"
              data-section="6"
              ref={setRef(5)}
              className="scroll-mt-28"
            >
              <SectionHeading id={6} icon={<Shield className="h-6 w-6" />} title="Intellectual Property" />
              <Prose>
                All content available on ASH Academy LMS — including videos, course materials,
                presentations, documents, graphics, logos, assessments, downloadable resources, and
                website content — is the intellectual property of ASH Academy LMS and is protected
                by applicable copyright laws.
              </Prose>
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Without prior written permission, you may not:
                </p>
                <BulletList
                  items={[
                    "Copy or reproduce course content.",
                    "Record or download course videos.",
                    "Share your course access or account with others.",
                    "Upload course content to other websites or social media platforms.",
                    "Sell, distribute, or use our content for commercial purposes.",
                  ]}
                />
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Unauthorised use of our content may result in account suspension, termination, and
                  legal action where applicable.
                </p>
              </div>
            </section>

            {/* 7. Course Completion Certificates */}
            <section
              id="tc-section-7"
              data-section="7"
              ref={setRef(6)}
              className="scroll-mt-28"
            >
              <SectionHeading id={7} icon={<Award className="h-6 w-6" />} title="Course Completion Certificates" />
              <div className="space-y-3">
                <BulletList
                  items={[
                    "Course Completion Certificates are issued only after you have successfully completed the required lessons and passed the final assessment.",
                    "Once your completion is verified and approved by our team, your certificate will be issued.",
                    "Certificates are awarded for learning and professional development purposes only. Completing a course does not guarantee employment, job placement, salary increases, or specific career outcomes.",
                  ]}
                />
              </div>
            </section>

            {/* 8. User Conduct */}
            <section
              id="tc-section-8"
              data-section="8"
              ref={setRef(7)}
              className="scroll-mt-28"
            >
              <SectionHeading id={8} icon={<AlertTriangle className="h-6 w-6" />} title="User Conduct" />
              <Prose>
                By using ASH Academy LMS, you agree to use the platform responsibly. You must not:
              </Prose>
              <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <BulletList
                  items={[
                    "Share your account or login credentials.",
                    "Copy, record, or distribute course content without permission.",
                    "Attempt to gain unauthorised access to the platform or its systems.",
                    "Upload harmful software or malicious content.",
                    "Use the platform for illegal, fraudulent, or unethical activities.",
                  ]}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Failure to comply with these Terms may result in the suspension or permanent
                termination of your account.
              </p>
            </section>

            {/* 9. Platform Availability */}
            <section
              id="tc-section-9"
              data-section="9"
              ref={setRef(8)}
              className="scroll-mt-28"
            >
              <SectionHeading id={9} icon={<Globe className="h-6 w-6" />} title="Platform Availability" />
              <Prose>
                We strive to keep ASH Academy LMS available at all times. However, temporary
                interruptions may occur due to scheduled maintenance, technical updates, or
                unforeseen circumstances beyond our control. We appreciate your understanding and
                will make every effort to restore services as quickly as possible.
              </Prose>
            </section>

            {/* 10. Account Suspension & Termination */}
            <section
              id="tc-section-10"
              data-section="10"
              ref={setRef(9)}
              className="scroll-mt-28"
            >
              <SectionHeading id={10} icon={<Ban className="h-6 w-6" />} title="Account Suspension & Termination" />
              <div className="space-y-3">
                <Prose>
                  ASH Academy LMS reserves the right to suspend or terminate any account that
                  violates these Terms &amp; Conditions or engages in activities that may harm the
                  platform, its users, or its content.
                </Prose>
                <Prose>
                  Refund eligibility, if any, will be determined in accordance with our Refund
                  Policy.
                </Prose>
              </div>
            </section>

            {/* 11. Limitation of Liability */}
            <section
              id="tc-section-11"
              data-section="11"
              ref={setRef(10)}
              className="scroll-mt-28"
            >
              <SectionHeading id={11} icon={<Scale className="h-6 w-6" />} title="Limitation of Liability" />
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="mb-1 text-sm italic text-muted-foreground">
                  &quot;ASH Academy LMS provides educational content to support your learning and
                  skill development.&quot;
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                While we strive to provide accurate, up-to-date, and high-quality content, we do
                not guarantee:
              </p>
              <div className="mt-3">
                <BulletList
                  items={[
                    "Employment opportunities",
                    "Job placements",
                    "Salary increases",
                    "Business success",
                    "Specific career outcomes",
                  ]}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Your success depends on your dedication, effort, and application of the knowledge
                and skills gained through our courses.
              </p>
            </section>

            {/* 12. Changes to These Terms */}
            <section
              id="tc-section-12"
              data-section="12"
              ref={setRef(11)}
              className="scroll-mt-28"
            >
              <SectionHeading id={12} icon={<RefreshCw className="h-6 w-6" />} title="Changes to These Terms" />
              <div className="space-y-3">
                <Prose>
                  We may update these Terms &amp; Conditions from time to time to reflect
                  improvements to our platform, changes in our services, or legal requirements.
                </Prose>
                <Prose>
                  Any updates will be published on this page with the revised Last Updated date.
                  Your continued use of ASH Academy LMS after any changes means you accept the
                  updated Terms &amp; Conditions.
                </Prose>
              </div>
            </section>

            {/* 13. Contact Us */}
            <section
              id="tc-section-13"
              data-section="13"
              ref={setRef(12)}
              className="scroll-mt-28"
            >
              <SectionHeading id={13} icon={<Mail className="h-6 w-6" />} title="Contact Us" />
              <Prose>
                If you have any questions about these Terms &amp; Conditions, we&apos;re here to
                help.
              </Prose>
              <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80 flex items-center gap-1">
                Contact Us
                <ExternalLink className="h-3 w-3" />
              </Link>
            </section>

          </main>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
