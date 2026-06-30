import React from 'react'
import { Button } from '../ui/button';

const stats = [
  { value: "+50k", label: "Active Students" },
  { value: "120+", label: "Countries Reached" },
  { value: "95%", label: "Success Rate" },
];

const Stats = () => {
  return (
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
            Join a community of high-achievers and world-class mentors dedicated
            to your professional evolution.
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
  );
}

export default Stats