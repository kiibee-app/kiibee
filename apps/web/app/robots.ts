import type { MetadataRoute } from "next";
import { getSiteUrl, ROBOTS_GENERATION_CONTEXT } from "@/utils/seo";

const SITE_URL = getSiteUrl(ROBOTS_GENERATION_CONTEXT);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
