// Explicit migration aliases preserve custom channel slugs while repairing known
// Danish-character loss. Both old and canonical paths remain valid in the API.
export const CREATOR_SLUG_ALIASES: Readonly<Record<string, string>> = {
  brianmrk: "brian-moerk",
  "brian-m-rk": "brian-moerk",
  akupunktrstinevogel: "akupunktoer-stine-vogel",
  "akupunkt-r-stine-vogel": "akupunktoer-stine-vogel",
  damkjrmedier: "damkjaer-medier",
  "damkj-r-medier": "damkjaer-medier",
  granlivelvre: "granli-velvaere",
  "granli-velv-re": "granli-velvaere",
  jannikreskoleogterapi: "janni-koereskole-og-terapi",
  "janni-k-reskole-og-terapi": "janni-koereskole-og-terapi",
  familierfdesfamilienspsykologgennemhelerejsen:
    "familier-foedes-familiens-psykolog-gennem-hele-rejsen",
  "familier-f-des-familiens-psykolog-gennem-hele-rejsen":
    "familier-foedes-familiens-psykolog-gennem-hele-rejsen",
  pdagogiskpsykologisktidsskrift: "paedagogisk-psykologisk-tidsskrift",
  "p-dagogisk-psykologisk-tidsskrift": "paedagogisk-psykologisk-tidsskrift",
  selvvrdkstedet: "selvvaer-dk-stedet",
  "selvv-r-dk-stedet": "selvvaer-dk-stedet",
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
