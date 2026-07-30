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
      </div>
    </section>
  );
}

export default Stats