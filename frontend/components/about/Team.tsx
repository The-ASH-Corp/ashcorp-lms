import React from 'react'
import Image from "next/image";


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

const Team = () => {
  return (
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
  );
}

export default Team