import React from 'react'
import Image from "next/image";
import  sufail  from "../../public/images/ASH_LMS_SUFAIL_photo.jpeg"
import  hr  from "../../public/images/ASH_LMS_HR_photo.jpeg"
import hashir from "../../public/images/ASH_LMS_HASHIR_photo.jpeg";
import SR from "../../public/images/ASH_LMS_SR_photo.jpeg";


const team = [
  {
    name: "SUFAIL P",
    role: "Chief Executive Officer",
    image: sufail,
  },
  {
    name: "SHIBILI RAHIMAN KP",
    role: "Co-founder",
    image: SR,
  },
  {
    name: "GOPIKA",
    role: "HUMAN RESOURCE",
    image: hr,
  },
  {
    name: "MOHAMMED HASHIR U",
    role: "ACADEMIC COORDINATOR",
    image: hashir,
  },
];

const Team = () => {
  return (
    <section id="mentors" className="bg-secondary py-20">
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