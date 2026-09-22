import { DA, EN } from "./common";
import type { AppLanguage } from "./language";
import { normalizeAppLanguage } from "./language";
import { CONTENT_TAB, VIEW } from "./Constants";

type LocalizedPair = { en: string; da: string };

const QUERY_KEY_MAP: readonly LocalizedPair[] = [
  { en: VIEW, da: "visning" },
  { en: CONTENT_TAB, da: "fane" },
];

const VIEW_VALUE_MAP: readonly LocalizedPair[] = [
  { en: "Overview", da: "oversigt" },
  { en: "Contents", da: "indhold" },
  { en: "Users", da: "brugere" },
  { en: "Settings", da: "indstillinger" },
  { en: "Help", da: "hjaelp" },
  { en: "profile", da: "profil" },
  { en: "purchased", da: "koebt" },
  { en: "currently-rented", da: "aktuelt-udlejet" },
  { en: "previously-rented", da: "tidligere-udlejet" },
  { en: "billings", da: "fakturering" },
  { en: "my-profile", da: "min-profil" },
];

const TAB_VALUE_MAP: readonly LocalizedPair[] = [
  { en: "settings", da: "indstillinger" },
  { en: "payout", da: "udbetaling" },
  { en: "payoutMethods", da: "udbetalingsmetoder" },
  { en: "notifications", da: "notifikationer" },
  { en: "export", da: "eksport" },
  { en: "search", da: "soegning" },
  { en: "collections", da: "samlinger" },
  { en: "appearance", da: "udseende" },
  { en: "coupons", da: "kuponer" },
  { en: "general", da: "generelt" },
  { en: "metadata", da: "metadata" },
  { en: "payment", da: "betaling" },
  { en: "registrations", da: "registreringer" },
  { en: "sales", da: "salg" },
];

function mapPair(
  value: string,
  pairs: readonly LocalizedPair[],
  target: AppLanguage,
): string {
  const pair = pairs.find((p) => p.en === value || p.da === value);
  if (!pair) return value;
  return target === EN ? pair.en : pair.da;
}

function toURLSearchParams(input: URLSearchParams | string): URLSearchParams {
  if (typeof input === "string") {
    const raw = input.startsWith("?") ? input.slice(1) : input;
    return new URLSearchParams(raw);
  }
  return new URLSearchParams(input.toString());
}

export function toCanonicalSearchParams(
  input: URLSearchParams | string,
): URLSearchParams {
  const source = toURLSearchParams(input);
  const result = new URLSearchParams();

  for (const [key, value] of source.entries()) {
    const canonicalKey = mapPair(key, QUERY_KEY_MAP, EN);
    let canonicalValue = value;

    if (canonicalKey === VIEW) {
      canonicalValue = mapPair(value, VIEW_VALUE_MAP, EN);
    } else if (canonicalKey === CONTENT_TAB) {
      canonicalValue = mapPair(value, TAB_VALUE_MAP, EN);
    }

    result.append(canonicalKey, canonicalValue);
  }

  return result;
}

export function localizeSearchParams(
  input: URLSearchParams | string,
  language: AppLanguage,
): URLSearchParams {
  const target = normalizeAppLanguage(language);
  const canonical = toCanonicalSearchParams(input);

  if (target === EN) return canonical;

  const result = new URLSearchParams();
  for (const [key, value] of canonical.entries()) {
    const localizedKey = mapPair(key, QUERY_KEY_MAP, DA);
    let localizedValue = value;

    if (key === VIEW) {
      localizedValue = mapPair(value, VIEW_VALUE_MAP, DA);
    } else if (key === CONTENT_TAB) {
      localizedValue = mapPair(value, TAB_VALUE_MAP, DA);
    }

    result.append(localizedKey, localizedValue);
  }

  return result;
}

export function formatSearch(params: URLSearchParams): string {
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function getCanonicalParam(
  input: URLSearchParams | string | null | undefined,
  enKey: string,
): string | null {
  if (!input) return null;
  return toCanonicalSearchParams(input).get(enKey);
}

function sortedSearchString(params: URLSearchParams): string {
  return [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort((a, b) => a.localeCompare(b))
    .join("&");
}

export function searchParamsPreferEqual(
  a: URLSearchParams,
  b: URLSearchParams,
): boolean {
  return sortedSearchString(a) === sortedSearchString(b);
}
