import {
  INDEXABLE_ROUTES,
  MONTHLY,
  getSiteUrl,
  SITEMAP_GENERATION_CONTEXT,
  WEEkLY,
} from "@/utils/seo";
import type { MetadataRoute } from "next";

const SITE_URL = getSiteUrl(SITEMAP_GENERATION_CONTEXT);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return INDEXABLE_ROUTES.map((pathname) => ({
    url: `${SITE_URL}${pathname === "/" ? "" : pathname}`,
    lastModified: now,
    changeFrequency: pathname === "/" ? WEEkLY : MONTHLY,
    priority: pathname === "/" ? 1 : 0.7,
  }));
}
