import Image from "next/image";
import {
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Users,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Redefining boundaries through experimental curriculum and cutting-edge tech integration.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "Upholding the highest standards of academic honesty and professional transparency.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a global network of elite peers, mentors, and industry disruptors.",
  },
  {
    icon: Share2,
    title: "Excellence",
    description:
      "Commitment to a standard that transcends 'good enough' to achieve the exceptional.",
  },
];

const team = [
  {
    name: "Dr. Aris Thorne",
    role: "Chief Executive Officer",
    image: "/images/team-1.png",
  },
  {
    name: "Prof. Julian Vane",
    role: "Head of Academics",
    image: "/images/team-2.png",
  },
  {
    name: "Sarah Jenkins",
    role: "Chief Operations Officer",
    image: "/images/team-3.png",
  },
  {
    name: "Marcus Chen",
    role: "Head of Student Success",
    image: "/images/team-4.png",
  },
];

const stats = [
  { value: "+50k", label: "Active Students" },
  { value: "120+", label: "Countries Reached" },
  { value: "95%", label: "Success Rate" },
];

const footerLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Faculty Portal",
  "Contact Us",
];

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Our Legacy
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Elevating Minds,
            <br />
            <span className="text-primary">Empowering Futures</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Ash Academy was born from a singular vision: to bridge the gap
            between traditional academic rigor and the dynamic needs of a
            globalized digital era. We cultivate the next generation of
            visionaries through elite mentorship and innovative pedagogy.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src="/images/campus.png"
              alt="Modern Ash Academy library overlooking the city skyline"
              width={720}
              height={560}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Architecting Excellence
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Founded by a collective of Oxford scholars and Silicon Valley
              pioneers, Ash Academy emerged as a response to the static nature
              of modern higher education. We believe that true learning happens
              at the intersection of proven theory and disruptive practice.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our journey began in a small research lab, exploring how immersive
              technology could enhance cognitive retention. Today, we stand as a
              global beacon for students who demand more than a degree—they
              demand a transformation.
            </p>
            <a
              href="#mentors"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Learn about our faculty
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              The Pillars of Ash
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Our values aren&apos;t just words on a wall; they are the
              algorithmic core of every decision we make.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <pillar.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="mentors" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Our Team
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Meet Our Visionaries
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Leading with conviction, our executive board combines decades of
              experience across academia and industry.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name}>
                <div className="overflow-hidden rounded-xl border border-border">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={`Portrait of ${member.name}`}
                    width={320}
                    height={320}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + CTA */}
      <section id="numbers" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
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
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Ready to start your journey?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Join a community of high-achievers and world-class mentors
              dedicated to your professional evolution.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">Apply for Enrollment</Button>
              <Button size="lg" variant="outline">
                Download Prospectus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              ASH ACADEMY
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              © 2026 Ash Academy. Elevating Academic Excellence Globally.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
