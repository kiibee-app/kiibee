import {
  INDEXABLE_ROUTES,
  MONTHLY,
  getDanishIndexablePath,
  getSiteUrl,
  SITEMAP_GENERATION_CONTEXT,
  WEEkLY,
} from "@/utils/seo";
import type { MetadataRoute } from "next";

const SITE_URL = getSiteUrl(SITEMAP_GENERATION_CONTEXT);

function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return INDEXABLE_ROUTES.map((pathname) => {
    const enPath = pathname;
    const daPath = getDanishIndexablePath(pathname);

    return {
      url: absoluteUrl(daPath),
      lastModified: now,
      changeFrequency: pathname === "/" ? WEEkLY : MONTHLY,
      priority: pathname === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          da: absoluteUrl(daPath),
          en: absoluteUrl(enPath),
          "x-default": absoluteUrl(daPath),
        },
      },
    };
  });
}
