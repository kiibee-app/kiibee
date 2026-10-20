import type { ExistingCreator } from "../types/existing-creator";

export const existingCreatorTableColumns = [
  "Owner",
  "Joined",
  "Location",
  "Channel",
  "Plan",
  "Metrics",
  "Sequence",
  "Status",
  "Visibility",
] as const;

export const existingCreatorLabels = {
  avatarFallback: "CR",
  noChannel: "No channel",
  noPlan: "No plan",
  noSlug: "No slug",
  notProvided: "Not provided",
  hide: "Hide",
  unhide: "Unhide",
  hiddenState: "Hidden",
  visibleState: "Visible",
  uploads: "uploads",
  subscribers: "subscribers",
  backToDetails: "Back to Details",
  loadingUploads: "Loading uploads...",
  failedToLoadUploads: "Failed to load uploads.",
  noUploadsFound: "No uploads found for this creator.",
  creatorDetailsTitle: "Creator Details",
} as const;

export function formatCreatorUploadsTitle(name?: string | null) {
  return `${name}'s Uploads`;
}

const KNOWN_BRAND_OWNERS: Record<string, string> = {
  // Fysioteamet / Funktionel Neuroterapeut
  "funktionel neuroterapeut 2026": "Jakob Hansen",
  "funktionel neuro terapeut": "Jakob Hansen",
  fysioteamet: "Jakob Hansen",
  "ida@fysioteamet.dk": "Jakob Hansen",
  "jh@fysioteamet.dk": "Jakob Hansen",
  "jakob.prv@gmail.com": "Jakob Hansen",

  // FBI.DK
  "fbi.dk": "Peter Alan Wheatley",
  "peter@fbi-productions.dk": "Peter Alan Wheatley",

  // Chief1
  chief1: "Lars Pedersen",
  "chiefment@gmail.com": "Lars Pedersen",

  // Microphone Entertainment
  "microphone entertainment": "Mick Øgendahl",
  "marlene@microphone.dk": "Mick Øgendahl",

  // Kammas Kantine
  "kammas kantine": "Jakob Kamma",
  "jakob@kafekammas.dk": "Jakob Kamma",

  // Red Barnet
  "red barnet": "Sia",
  "sia@redbarnet.dk": "Sia",

  // Damkjær Medier
  "damkjær medier": "Simone Damkjær",
  "simone@damkjaer-medier.dk": "Simone Damkjær",

  // Tania Ellis
  "tania ellis - the social business company": "Tania Ellis",
  "tania ellis": "Tania Ellis",
  "te@taniaellis.com": "Tania Ellis",
  "te@taniaellis.dk": "Tania Ellis",

  // Langes Entertainment
  "langes entertainment aps": "Nicolaj Lange",
  "book@nicolajlange.dk": "Nicolaj Lange",

  // SigneNeslein
  "signeneslein.dk": "Signe Neslein",
  "signe@neslein.com": "Signe Neslein",

  // Networker
  networker: "Henrik Havemand",
  "hej@henrikhavemand.dk": "Henrik Havemand",
  "henrik.v.meyer@outlook.com": "Henrik Havemand",

  // You Consulting
  "you consulting": "Jannie Hvidberg",
  "jannie.hvidberg@gmail.com": "Jannie Hvidberg",
  "you@youconsulting.dk": "Jannie Hvidberg",

  // SkoleRo
  "skolero aps": "Line",
  skolero: "Line",
  "line@skolero.dk": "Line",

  // Uffe Holm
  "uffe holm": "Uffe Holm",
  "malene@uffeholm.dk": "Uffe Holm",

  // Amin Jensen Entertainment
  "amin jensen entertainment": "Amin Jensen",
  "amin@aminjensen.dk": "Amin Jensen",

  // Comedy-TV
  "comedy-tv": "Dan Andersen",
  "halfters@gmail.com": "Dan Andersen",

  // Britta Koch
  "britta koch - qigong": "Britta Koch",
  "undertryk@gmail.com": "Britta Koch",

  // ElStudio
  elstudio: "Stine Joy",
  "info@elstudio.dk": "Stine Joy",

  // RauJensen
  raujensen: "Christine Rau Jensen",
  "christineraujensen@gmail.com": "Christine Rau Jensen",

  // Songs Of Jacob Elk
  "songs of jacob elk": "Jacob Elk",
  "jacobkelk@gmail.com": "Jacob Elk",

  // gymstream
  gymstream: "Lars Borly",
  "lars.borly@gmail.com": "Lars Borly",

  // Morten Bonde Development
  "morten bonde development": "Morten Bonde",
  "mb@mortenbonde.dk": "Morten Bonde",

  // NuVenue / Gottleben
  nuvenue: "Kaare Thomsen",
  gottleben: "Kaare Thomsen",
  "info@gottleben.com": "Kaare Thomsen",

  // TjelesVenner / Marie Brixtofte
  tjelesvenner: "Marie Brixtofte",
  mariebrixtofte: "Marie Brixtofte",

  // Marner Analytics
  "marner analytics": "Marner Michael",
  "marner.michael@yahoo.com": "Marner Michael",

  // Hundedamen
  hundedamen: "Christin",
  "christin@hundedamen.dk": "Christin",

  // Kit Nørgaard
  "kitnoergaard.dk": "Kit Nørgaard",
  "info@kitnoergaard.dk": "Kit Nørgaard",

  // Kryptovaluta for kvinder
  "kryptovaluta for kvinder": "Line",
  "line.frkr@gmail.com": "Line",
};

function isBrandOrDomain(value?: string | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.startsWith("umb://")) return true;
  if (/^\d+$/.test(trimmed)) return true;
  if (/\.(dk|com|net|org|nu|eu)$/i.test(trimmed)) return true;
  if (/^(aps|a\/s|a-s)$/i.test(trimmed)) return true;
  return false;
}

function isValidPersonName(value?: string | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.length < 3) return false;
  if (trimmed.toLowerCase() === "jah") return false;
  if (isBrandOrDomain(trimmed)) return false;
  return true;
}

export function getExistingCreatorDisplayName(
  creator: ExistingCreator,
): string {
  // 1. If ownerName is provided from backend (e.g. from creator_owners or resolved by backend)
  // and is a valid name, THIS IS THE #1 SOURCE OF TRUTH!
  if (isValidPersonName(creator.ownerName)) {
    return creator.ownerName!.trim();
  }

  const emailKey = creator.email?.toLowerCase().trim();
  const channelKey = creator.channelName?.toLowerCase().trim();
  const companyKey = creator.companyName?.toLowerCase().trim();
  const fullNameKey = creator.fullName?.toLowerCase().trim();

  // 2. Explicit brand channels owner mapping (exact keys)
  if (emailKey && KNOWN_BRAND_OWNERS[emailKey]) {
    return KNOWN_BRAND_OWNERS[emailKey];
  }
  if (channelKey && KNOWN_BRAND_OWNERS[channelKey]) {
    return KNOWN_BRAND_OWNERS[channelKey];
  }
  if (companyKey && KNOWN_BRAND_OWNERS[companyKey]) {
    return KNOWN_BRAND_OWNERS[companyKey];
  }
  if (fullNameKey && KNOWN_BRAND_OWNERS[fullNameKey]) {
    return KNOWN_BRAND_OWNERS[fullNameKey];
  }

  // 2b. Partial / domain matches for known brand channels
  if (
    channelKey?.includes("neuroterapeut") ||
    channelKey?.includes("fysioteamet") ||
    emailKey?.endsWith("@fysioteamet.dk")
  ) {
    return "Jakob Hansen";
  }
  if (
    channelKey?.includes("you consulting") ||
    emailKey?.includes("youconsulting")
  ) {
    return "Jannie Hvidberg";
  }
  if (channelKey?.includes("skolero") || emailKey?.includes("skolero")) {
    return "Line";
  }
  if (
    channelKey?.includes("morten bonde") ||
    emailKey?.includes("mortenbonde")
  ) {
    return "Morten Bonde";
  }
  if (channelKey?.includes("tania ellis") || emailKey?.includes("taniaellis")) {
    return "Tania Ellis";
  }
  if (channelKey?.includes("britta koch")) {
    return "Britta Koch";
  }
  if (channelKey?.includes("jacob elk")) {
    return "Jacob Elk";
  }
  if (channelKey?.includes("marner")) {
    return "Marner Michael";
  }
  if (channelKey?.includes("hundedamen") || emailKey?.includes("hundedamen")) {
    return "Christin";
  }

  // 3. From user's first/last name parts, if not matching channel brand
  const fromParts = [creator.firstName, creator.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (
    isValidPersonName(fromParts) &&
    fromParts.toLowerCase() !== channelKey &&
    fromParts.toLowerCase() !== companyKey
  ) {
    return fromParts;
  }

  // 4. From user's full name, if not matching channel brand
  if (
    isValidPersonName(creator.fullName) &&
    creator.fullName!.trim().toLowerCase() !== channelKey &&
    creator.fullName!.trim().toLowerCase() !== companyKey
  ) {
    return creator.fullName!.trim();
  }

  return creator.fullName?.trim() || creator.email;
}

export function getExistingCreatorChannelName(creator: ExistingCreator) {
  const fromParts = [creator.firstName, creator.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    creator.channelName?.trim() ||
    creator.companyName?.trim() ||
    fromParts ||
    creator.fullName?.trim() ||
    null
  );
}

export function getExistingCreatorInitials(name: string) {
  const [first = "", second = ""] = name.trim().split(/\s+/);
  return (
    `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase() ||
    existingCreatorLabels.avatarFallback
  );
}

export function formatExistingCreatorStatus(status: string) {
  return status.replaceAll("-", " ");
}
