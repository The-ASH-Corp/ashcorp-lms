import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin workspace root to this directory so Turbopack ignores any
    // parent-level lockfiles (e.g. Hostinger's /home/u894094815/package-lock.json)
    root: __dirname,
  },

  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol:"https",
        hostname:"ashacademylmscontent.s3.eu-north-1.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "ashacademylms.com",
      },
       {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
