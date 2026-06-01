import type { NextConfig } from "next";
import { getSiteUrl, INDEXABLE_ROUTES, SEO_HEADERS_CONTEXT } from "./utils/seo";

const SITE_URL = getSiteUrl(SEO_HEADERS_CONTEXT);

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      ...INDEXABLE_ROUTES.map((pathname) => ({
        source: pathname,
        headers: [
          {
            key: "Link",
            value: `<${SITE_URL}${pathname === "/" ? "" : pathname}>; rel="canonical"`,
          },
        ],
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
