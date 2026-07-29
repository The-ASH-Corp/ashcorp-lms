import { Lightbulb, Share2, ShieldCheck, Users } from 'lucide-react';

const pillars = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We constantly evolve our courses and platform, blending modern teaching methods with practical, real-world skills learners can actually use.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We're honest about what our courses deliver — no filler, no false promises. Just clear, quality content that respects your time and trust.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We're building a growing network of learners, mentors, and industry experts who support each other's growth, long after a course ends.",
  },
  {
    icon: Share2,
    title: "Excellence",
    description:
      "We hold every course to a high standard — because \"good enough\" isn't good enough when it comes to your career and your goals.",
  },
];

const Pillars = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            The Pillars of ASH Academy
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            These aren&apos;t just values on a page they&apos;re the foundation behind every course we build and every learner we support.
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
  );
}

export default Pillars