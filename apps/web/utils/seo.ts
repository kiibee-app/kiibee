export const WEEkLY = "weekly";
export const MONTHLY = "monthly";
export const TRAILING_SLASH_REGEX = /\/+$/;
export const SEO_HEADERS_CONTEXT = "SEO headers";
export const ROBOTS_GENERATION_CONTEXT = "robots generation";
export const SITEMAP_GENERATION_CONTEXT = "sitemap generation";

export const INDEXABLE_ROUTES = [
  "/",
  "/about-kiibee",
  "/cookie-settings",
  "/explore",
  "/explore-creators",
  "/for-creators",
  "/how-it-works",
  "/pricing",
  "/privacy-policy",
  "/single-collection",
  "/subscription",
  "/subscription-terms",
  "/support",
  "/terms-of-service",
  "/tutorial-videos",
] as const;

export function getSiteUrl(errorContext: string): string {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

  if (!rawSiteUrl) {
    throw new Error(
      `SITE_URL or NEXT_PUBLIC_SITE_URL must be set for ${errorContext}.`,
    );
  }

  return rawSiteUrl.replace(TRAILING_SLASH_REGEX, "");
}
