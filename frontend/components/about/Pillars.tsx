import { Lightbulb, Share2, ShieldCheck, Users } from 'lucide-react';

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
      "Building a global network of elite peers, mentors, and industry disruptor.",
  },
  {
    icon: Share2,
    title: "Excellence",
    description:
      "Commitment to a standard that transcends 'good enough' to achieve the exceptional.",
  },
];

const Pillars = () => {
  return (
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
  );
}

export default Pillars