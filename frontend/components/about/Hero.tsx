import React from "react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
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
          Ash Academy was born from a singular vision: to bridge the gap between
          traditional academic rigor and the dynamic needs of a globalized
          digital era. We cultivate the next generation of visionaries through
          elite mentorship and innovative pedagogy.
        </p>
      </div>
    </section>
  );
};

export default Hero;
