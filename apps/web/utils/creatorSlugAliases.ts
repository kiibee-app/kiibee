// Explicit migration aliases preserve custom channel slugs while repairing known
// Danish-character loss. Both old and canonical paths remain valid in the API.
export const CREATOR_SLUG_ALIASES: Readonly<Record<string, string>> = {
  jacobtaarnhj: "jacob-taarnhoej",
  "jacob-taarnh-j": "jacob-taarnhoej",
};

export function canonicalCreatorSlug(slug: string): string {
  return CREATOR_SLUG_ALIASES[slug.toLowerCase()] ?? slug;
}

export function creatorSlugVariants(slug: string): string[] {
  const canonical = canonicalCreatorSlug(slug);
  return [
    canonical,
    ...Object.keys(CREATOR_SLUG_ALIASES).filter(
      (alias) => CREATOR_SLUG_ALIASES[alias] === canonical,
    ),
  ];
}
