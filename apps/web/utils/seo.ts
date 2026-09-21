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
  "/creator-terms",
  "/explore",
  "/explore-creators",
  "/for-creators",
  "/how-it-works",
  "/pricing",
  "/privacy-policy",
  "/single-collection",
  "/subscription",
  "/support",
  "/terms-of-service",
  "/tutorial-videos",
] as const;

const INDEXABLE_ROUTE_DA: Record<(typeof INDEXABLE_ROUTES)[number], string> = {
  "/": "/",
  "/about-kiibee": "/om-kiibee",
  "/cookie-settings": "/cookie-indstillinger",
  "/creator-terms": "/skaber-vilkaar",
  "/explore": "/udforsk",
  "/explore-creators": "/udforsk-skabere",
  "/for-creators": "/for-skabere",
  "/how-it-works": "/saadan-fungerer-det",
  "/pricing": "/priser",
  "/privacy-policy": "/privatlivspolitik",
  "/single-collection": "/samling",
  "/subscription": "/abonnement",
  "/support": "/support",
  "/terms-of-service": "/vilkaar",
  "/tutorial-videos": "/tutorial-videoer",
};

export function getLocalizedIndexableRoutes(): string[] {
  const paths = new Set<string>();
  for (const route of INDEXABLE_ROUTES) {
    paths.add(route);
    paths.add(INDEXABLE_ROUTE_DA[route]);
  }
  return [...paths];
}

export function getDanishIndexablePath(
  pathname: (typeof INDEXABLE_ROUTES)[number],
): string {
  return INDEXABLE_ROUTE_DA[pathname];
}

export function getSiteUrl(errorContext: string): string {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

  if (!rawSiteUrl) {
    throw new Error(
      `SITE_URL or NEXT_PUBLIC_SITE_URL must be set for ${errorContext}.`,
    );
  }

  return rawSiteUrl.replace(TRAILING_SLASH_REGEX, "");
}
