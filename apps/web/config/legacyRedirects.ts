export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  // Block or redirect legacy Umbraco admin/system paths
  {
    source: "/umbraco/:path*",
    destination: "/",
    permanent: true,
  },
  // Add mapped legacy routes here as identified from old site crawl / Google Search Console:
  // e.g.:
  // {
  //   source: "/om-os",
  //   destination: "/om-kiibee",
  //   permanent: true,
  // },
] as const;
