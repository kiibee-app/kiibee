import type { NextConfig } from "next";
import {
  getLocalizedIndexableRoutes,
  getSiteUrl,
  SEO_HEADERS_CONTEXT,
} from "./utils/seo";

const SITE_URL = getSiteUrl(SEO_HEADERS_CONTEXT);
const INDEXABLE_PATHS = getLocalizedIndexableRoutes();

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      fileName: true,
      meaninglessFileNames: ["index", "styles"],
    },
  },
  async headers() {
    return [
      ...INDEXABLE_PATHS.map((pathname) => ({
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
    qualities: [75, 95],
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
      {
        protocol: "https",
        hostname: "kiibee.dk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.kiibee.dk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "videodelivery.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloudflarestream.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
