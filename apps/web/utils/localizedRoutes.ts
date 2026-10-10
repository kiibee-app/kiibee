import { DA, EN, STORAGE_KEY } from "./common";
import type { AppLanguage } from "./language";
import { normalizeAppLanguage } from "./language";
import {
  formatSearch,
  localizeSearchParams,
  searchParamsPreferEqual,
} from "./localizedQueryParams";

export {
  formatSearch,
  getCanonicalParam,
  localizeSearchParams,
  searchParamsPreferEqual,
  toCanonicalSearchParams,
} from "./localizedQueryParams";

type LocalizedPair = { en: string; da: string };

export const LOCALIZED_STATIC_ROUTES: readonly LocalizedPair[] = [
  {
    en: "/auth/signup-creator/request-sent",
    da: "/auth/tilmeld-skaber/anmodning-sendt",
  },
  {
    en: "/auth/signup-viewer/preferences",
    da: "/auth/tilmeld-seer/praeferencer",
  },
  { en: "/auth/signup-creator", da: "/auth/tilmeld-skaber" },
  { en: "/auth/signup-viewer", da: "/auth/tilmeld-seer" },
  { en: "/auth/forget-password", da: "/auth/glemt-adgangskode" },
  { en: "/auth/reset-password", da: "/auth/nulstil-adgangskode" },
  { en: "/auth/login", da: "/auth/log-ind" },
  { en: "/auth/signup", da: "/auth/tilmeld" },
  { en: "/access-request/approve", da: "/adgangs-anmodning/godkend" },
  { en: "/subscription/success", da: "/abonnement/succes" },
  { en: "/subscription/failure", da: "/abonnement/fejl" },
  { en: "/subscription-terms", da: "/abonnement-vilkaar" },
  { en: "/subscription", da: "/abonnement" },
  { en: "/payment/success", da: "/betaling/succes" },
  { en: "/payment/failure", da: "/betaling/fejl" },
  { en: "/card/success", da: "/kort/succes" },
  { en: "/card/failure", da: "/kort/fejl" },
  { en: "/explore-creators", da: "/udforsk-skabere" },
  { en: "/single-collection", da: "/samling" },
  { en: "/creator-plans", da: "/skaber-planer" },
  { en: "/creator-terms", da: "/skaber-vilkaar" },
  { en: "/about-kiibee", da: "/om-kiibee" },
  { en: "/how-it-works", da: "/saadan-fungerer-det" },
  { en: "/for-creators", da: "/for-skabere" },
  { en: "/tutorial-videos", da: "/tutorial-videoer" },
  { en: "/terms-of-service", da: "/vilkaar" },
  { en: "/privacy-policy", da: "/privatlivspolitik" },
  { en: "/cookie-settings", da: "/cookie-indstillinger" },
  { en: "/pricing", da: "/priser" },
  { en: "/support", da: "/support" },
  { en: "/explore", da: "/udforsk" },
  { en: "/", da: "/" },
] as const;

export const LOCALIZED_PREFIX_ROUTES: readonly LocalizedPair[] = [
  { en: "/explore/all-content", da: "/udforsk/alt-indhold" },
  { en: "/explore/category", da: "/udforsk/kategori" },
  { en: "/formats", da: "/formater" },
  { en: "/creators", da: "/skabere" },
  { en: "/content", da: "/indhold" },
  { en: "/creator", da: "/skaber" },
  { en: "/dashboard", da: "/kontrolpanel" },
] as const;

const CREATOR_COLLECTIONS_SUFFIX_EN = "/collections";
const CREATOR_COLLECTIONS_SUFFIX_DA = "/samlinger";

const PARAM_VALUE_MAPS: Record<string, LocalizedPair[]> = {
  creatorFilter: [
    { en: "all", da: "alle" },
    { en: "featured", da: "udvalgte" },
    { en: "new", da: "nye" },
    { en: "popular", da: "populaere" },
  ],
  allContent: [
    { en: "everything", da: "alt" },
    { en: "new", da: "nye" },
    { en: "popular", da: "populaere" },
    { en: "free", da: "gratis" },
  ],
  dashboard: [
    { en: "creators", da: "skabere" },
    { en: "viewer", da: "seer" },
  ],
};

function stripTrailingSlash(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function splitPathAndHash(path: string): {
  pathname: string;
  search: string;
  hash: string;
} {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const searchIndex = withoutHash.indexOf("?");
  const search = searchIndex >= 0 ? withoutHash.slice(searchIndex) : "";
  const pathname =
    searchIndex >= 0 ? withoutHash.slice(0, searchIndex) : withoutHash;
  return { pathname, search, hash };
}

function mapParamValue(
  value: string,
  pairs: LocalizedPair[],
  target: AppLanguage,
): string {
  const pair = pairs.find((p) => p.en === value || p.da === value);
  if (!pair) return value;
  return target === EN ? pair.en : pair.da;
}

function localizeCreatorCollections(
  pathname: string,
  target: AppLanguage,
): string | null {
  const enPrefix = "/creator/";
  const daPrefix = "/skaber/";

  if (
    pathname.startsWith(enPrefix) &&
    pathname.endsWith(CREATOR_COLLECTIONS_SUFFIX_EN)
  ) {
    const layout = pathname.slice(
      enPrefix.length,
      pathname.length - CREATOR_COLLECTIONS_SUFFIX_EN.length,
    );
    if (!layout || layout.includes("/")) return null;
    return target === DA
      ? `${daPrefix}${layout}${CREATOR_COLLECTIONS_SUFFIX_DA}`
      : `${enPrefix}${layout}${CREATOR_COLLECTIONS_SUFFIX_EN}`;
  }

  if (
    pathname.startsWith(daPrefix) &&
    pathname.endsWith(CREATOR_COLLECTIONS_SUFFIX_DA)
  ) {
    const layout = pathname.slice(
      daPrefix.length,
      pathname.length - CREATOR_COLLECTIONS_SUFFIX_DA.length,
    );
    if (!layout || layout.includes("/")) return null;
    return target === DA
      ? `${daPrefix}${layout}${CREATOR_COLLECTIONS_SUFFIX_DA}`
      : `${enPrefix}${layout}${CREATOR_COLLECTIONS_SUFFIX_EN}`;
  }

  return null;
}

function localizeDynamicRemainder(
  enPrefix: string,
  remainder: string,
  target: AppLanguage,
): string {
  if (!remainder) return "";

  const segments = remainder.split("/").filter(Boolean);
  if (enPrefix === "/creators" && segments[0]) {
    segments[0] = mapParamValue(
      segments[0],
      PARAM_VALUE_MAPS.creatorFilter,
      target,
    );
  }
  if (enPrefix === "/explore/all-content" && segments[0]) {
    segments[0] = mapParamValue(
      segments[0],
      PARAM_VALUE_MAPS.allContent,
      target,
    );
  }
  if (enPrefix === "/dashboard" && segments[0]) {
    segments[0] = mapParamValue(
      segments[0],
      PARAM_VALUE_MAPS.dashboard,
      target,
    );
  }

  return `/${segments.join("/")}`;
}

function findStaticPair(pathname: string): LocalizedPair | undefined {
  return LOCALIZED_STATIC_ROUTES.find(
    (route) => route.en === pathname || route.da === pathname,
  );
}

function findPrefixPair(pathname: string): {
  pair: LocalizedPair;
  remainder: string;
  matchedLang: AppLanguage;
} | null {
  for (const pair of LOCALIZED_PREFIX_ROUTES) {
    if (pathname === pair.en || pathname.startsWith(`${pair.en}/`)) {
      return {
        pair,
        remainder: pathname.slice(pair.en.length),
        matchedLang: EN,
      };
    }
    if (pathname === pair.da || pathname.startsWith(`${pair.da}/`)) {
      return {
        pair,
        remainder: pathname.slice(pair.da.length),
        matchedLang: DA,
      };
    }
  }
  return null;
}

export function toCanonicalPathname(pathname: string): string {
  const normalized = stripTrailingSlash(pathname || "/");

  const collections = localizeCreatorCollections(normalized, EN);
  if (collections) return collections;

  const exact = findStaticPair(normalized);
  if (exact) return exact.en;

  const prefix = findPrefixPair(normalized);
  if (prefix) {
    const remainder = localizeDynamicRemainder(
      prefix.pair.en,
      prefix.remainder,
      EN,
    );
    return `${prefix.pair.en}${remainder}`;
  }

  return normalized;
}

export function localizePathname(
  pathname: string,
  language: AppLanguage,
): string {
  const canonical = toCanonicalPathname(pathname);
  const target = normalizeAppLanguage(language);

  const collections = localizeCreatorCollections(canonical, target);
  if (collections) return collections;

  const exact = findStaticPair(canonical);
  if (exact) return target === DA ? exact.da : exact.en;

  const prefix = findPrefixPair(canonical);
  if (prefix) {
    const targetPrefix = target === DA ? prefix.pair.da : prefix.pair.en;
    const remainder = localizeDynamicRemainder(
      prefix.pair.en,
      prefix.remainder || canonical.slice(prefix.pair.en.length),
      target,
    );
    return `${targetPrefix}${remainder}`;
  }

  return canonical;
}

export function localizeHref(href: string, language: AppLanguage): string {
  if (!href || href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  if (!href.startsWith("/")) return href;

  const { pathname, search, hash } = splitPathAndHash(href);
  const localizedPath = localizePathname(pathname, language);
  const localizedSearch = search
    ? formatSearch(localizeSearchParams(search, language))
    : "";
  return `${localizedPath}${localizedSearch}${hash}`;
}

export function isPreferredLocalizedUrl(
  pathname: string,
  searchParams: URLSearchParams,
  language: AppLanguage,
): boolean {
  const preferredPath = localizePathname(pathname, language);
  if (pathname !== preferredPath) return false;

  const preferredSearch = localizeSearchParams(searchParams, language);
  return searchParamsPreferEqual(searchParams, preferredSearch);
}

export function isLocalizedPathname(pathname: string): boolean {
  const normalized = stripTrailingSlash(pathname || "/");
  if (findStaticPair(normalized)) return true;
  if (localizeCreatorCollections(normalized, EN)) return true;
  return Boolean(findPrefixPair(normalized));
}

export function getPathLanguage(pathname: string): AppLanguage | null {
  const normalized = stripTrailingSlash(pathname || "/");

  if (localizeCreatorCollections(normalized, DA) === normalized) return DA;
  if (localizeCreatorCollections(normalized, EN) === normalized) return EN;

  const exact = findStaticPair(normalized);
  if (exact) {
    if (exact.en === exact.da) return null;
    return exact.da === normalized ? DA : EN;
  }

  const prefix = findPrefixPair(normalized);
  if (prefix) {
    if (prefix.pair.en === prefix.pair.da) return null;
    return prefix.matchedLang;
  }

  return null;
}

export function readLanguageFromCookieHeader(
  cookieHeader: string | null | undefined,
): AppLanguage {
  if (!cookieHeader) return DA;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STORAGE_KEY}=`));

  if (!match) return DA;
  return normalizeAppLanguage(match.slice(STORAGE_KEY.length + 1));
}
