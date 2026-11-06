import { IMAGE_REMOTE_PATTERNS } from "./utils/imageDelivery";
import type { NextConfig } from "next";
import {
  getLocalizedIndexableRoutes,
  getSiteUrl,
  SEO_HEADERS_CONTEXT,
} from "./utils/seo";
import { LEGACY_REDIRECTS } from "./config/legacyRedirects";

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
  async redirects() {
    return [...LEGACY_REDIRECTS];
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
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95],
    // Cache resized public images rather than downloading full-size originals.
    minimumCacheTTL: 86400,
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
};

export default nextConfig;
