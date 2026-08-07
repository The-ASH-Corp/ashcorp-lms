"use client";

import React from "react";
import { useGetContactSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const defaultMapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d712.5535472308395!2d75.94660271623343!3d10.953023494019337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b35545b7a371%3A0x59efa33ed27234a7!2sAshcorp%20Technology-%20Digital%20Marketing%2C%20Software%20Development%2C%20Flutter%20%2C%20MERN%20Stack%20Development%20in%20Tirur!5e1!3m2!1sen!2sin!4v1785563688272!5m2!1sen!2sin";

const Institution = () => {
  const { data: settings } = useGetContactSettingsQuery();
  const locationMap = settings?.locationMap;
  const isVisible =
    settings?.sectionVisibility?.institutionMap !== false &&
    locationMap?.enabled !== false;

  if (!isVisible) {
    return null;
  }

  const mapSrc = locationMap?.mapEmbedUrl || defaultMapSrc;

  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-6xl px-6 mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {locationMap?.title || "Our Campus & Location"}
        </h2>
        {locationMap?.address && (
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            {locationMap.address}
          </p>
        )}
      </div>

      <div className="w-full px-0">
        <div className="overflow-hidden border-y border-border shadow-sm rounded-2xl mx-2">
          <iframe
            title="Ashcorp location map"
            src={mapSrc}
            className="block h-[62vh] min-h-80 w-full sm:h-[68vh] lg:h-[74vh] rounded-2xl"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Institution;
