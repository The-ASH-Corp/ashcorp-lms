import { ArrowRight } from 'lucide-react';
import Image from "next/image";

const About = () => {
  return (
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
            pioneers, Ash Academy emerged as a response to the static nature of
            modern higher education. We believe that true learning happens at
            the intersection of proven theory and disruptive practice.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Our journey began in a small research lab, exploring how immersive
            technology could enhance cognitive retention. Today, we stand as a
            global beacon for students who demand more than a degree—they demand
            a transformation.
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
  );
}

export default About