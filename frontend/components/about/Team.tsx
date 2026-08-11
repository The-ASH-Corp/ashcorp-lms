"use client";

import React from "react";
import Image from "next/image";
import { useGetAboutSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const defaultMembers = [
  {
    id: "vis-1",
    name: "SUFAIL P",
    role: "Chief Executive Officer",
    image: "/images/ASH_LMS_SUFAIL_photo.jpeg",
  },
  {
    id: "vis-2",
    name: "SHIBILI RAHIMAN KP",
    role: "Co-founder",
    image: "/images/ASH_LMS_SR_photo.jpeg",
  },
  {
    id: "vis-3",
    name: "GOPIKA",
    role: "HUMAN RESOURCE",
    image: "/images/ASH_LMS_HR_photo.jpeg",
  },
  {
    id: "vis-4",
    name: "MOHAMMED HASHIR U",
    role: "ACADEMIC COORDINATOR",
    image: "/images/ASH_LMS_HASHIR_photo.jpeg",
  },
];

const Team = () => {
  const { data: settings } = useGetAboutSettingsQuery();
  const leadershipSettings = settings?.leadership;
  const isVisible = settings?.sectionVisibility?.leadership !== false && leadershipSettings?.enabled !== false;

  if (!isVisible) {
    return null;
  }

  const team = leadershipSettings?.items || defaultMembers;

  return (
    <section id="mentors" className="bg-secondary py-20">
      <div className="mx-auto w-full max-w-[120rem] px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Our Team
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {leadershipSettings?.title || "Meet Our Visionaries"}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {leadershipSettings?.subtitle ||
              "Leading with conviction, our executive board combines decades of experience across academia and industry."}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => {
            const imgSrc = member.image || "/placeholder.svg";
            return (
              <div key={member.id || member.name}>
                <div className="overflow-hidden rounded-xl border border-border aspect-square relative">
                  {imgSrc.startsWith("data:") || imgSrc.startsWith("http") ? (
                    /* eslint-disable-next-html-element-for-img */
                    <img
                      src={imgSrc}
                      alt={`Portrait of ${member.name}`}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={imgSrc}
                      alt={`Portrait of ${member.name}`}
                      width={320}
                      height={320}
                      className="aspect-square w-full object-cover"
                    />
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {member.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;