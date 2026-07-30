import React from 'react'
import Institution from './Institution';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-72 w-160 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Connect with Us
        </p>
        <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Get in Touch with Academic Zenith
        </h1>
        <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Whether you&apos;re a prospective student seeking guidance, a
          corporate entity looking for strategic partnerships, or a media
          representative, our specialized teams are ready to provide the
          professional support you deserve.
        </p>
      </div>
      
    </section>
  );
}

export default Hero