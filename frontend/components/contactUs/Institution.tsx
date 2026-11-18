"use client";

import React from "react";

import { useGetContactSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const defaultPrimaryMapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d712.5535472308395!2d75.94660271623343!3d10.953023494019337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b35545b7a371%3A0x59efa33ed27234a7!2sAshcorp%20Technology-%20Digital%20Marketing%2C%20Software%20Development%2C%20Flutter%20%2C%20MERN%20Stack%20Development%20in%20Tirur!5e1!3m2!1sen!2sin!4v1785563688272!5m2!1sen!2sin";

const defaultSecondaryMapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1455.378419197244!2d75.83347121985852!3d11.24809597559352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6597c304c1f3b%3A0xbb7abc23c1ea8a!2sHiLITE%20Business%20Park!5e1!3m2!1sen!2sin!4v1794982341203!5m2!1sen!2sin";

function extractMapEmbedUrl(urlOrIframe: string | undefined, fallback: string): string {
  if (!urlOrIframe || !urlOrIframe.trim()) return fallback;
  const match = urlOrIframe.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }
  return urlOrIframe.trim();
}

const Institution = () => {
  const { data: settings } = useGetContactSettingsQuery();
  const locationMap = settings?.locationMap;
  const isVisible =
    settings?.sectionVisibility?.institutionMap !== false &&
    locationMap?.enabled !== false;

  if (!isVisible) {
    return null;
  }

  // Section title
  const sectionTitle =
    locationMap?.sectionTitle || "Our Campus & Location";

  // Location 1 (Primary)
  const loc1Title =
    locationMap?.title && locationMap?.title !== "Our Campus & Location"
      ? locationMap.title
      : "Tirur Campus";
  const loc1Address =
    locationMap?.address ||
    "Ashcorp Technology - Digital Marketing, Software Development, Tirur";
  const loc1MapSrc = extractMapEmbedUrl(
    locationMap?.mapEmbedUrl,
    defaultPrimaryMapSrc
  );

  // Location 2 (Secondary)
  const loc2Title =
    locationMap?.secondaryTitle || "Calicut Campus (HiLITE Business Park)";
  const loc2Address =
    locationMap?.secondaryAddress ||
    "HiLITE Business Park, Kozhikode, Kerala";
  const loc2MapSrc = extractMapEmbedUrl(
    locationMap?.secondaryMapEmbedUrl,
    defaultSecondaryMapSrc
  );

  const locations = [
    {
      id: "campus-1",
      badge: "Campus 1",
      title: loc1Title,
      address: loc1Address,
      mapSrc: loc1MapSrc,
    },
    {
      id: "campus-2",
      badge: "Campus 2",
      title: loc2Title,
      address: loc2Address,
      mapSrc: loc2MapSrc,
    },
  ];

  return (
    <section className="bg-secondary py-14 mt-6">
      {/* Section Header */}
      <div className="mx-auto w-full max-w-[120rem] px-6 lg:px-12 xl:px-20 mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {sectionTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Visit our campuses to experience our collaborative learning environment and state-of-the-art facilities.
        </p>
      </div>

      {/* Side-by-Side Maps Grid */}
      <div className="mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <iframe
              title={`${loc.title} location map`}
              src={loc.mapSrc}
              className="block h-[62vh] min-h-[420px] w-full rounded-2xl border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Institution;
