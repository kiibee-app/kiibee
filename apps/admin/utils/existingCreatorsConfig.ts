import type { ExistingCreator } from "../types/existing-creator";

export const existingCreatorTableColumns = [
  "Creator",
  "Joined",
  "Location",
  "Channel",
  "Plan",
  "Metrics",
  "Status",
  "Published",
] as const;

export const existingCreatorLabels = {
  avatarFallback: "CR",
  noChannel: "No channel",
  noPlan: "No plan",
  noSlug: "No slug",
  notProvided: "Not provided",
  published: "Published",
  draft: "Draft",
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

export function getExistingCreatorDisplayName(creator: ExistingCreator) {
  const fromParts = [creator.firstName, creator.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fromParts ||
    creator.fullName?.trim() ||
    creator.channelName?.trim() ||
    creator.companyName?.trim() ||
    creator.email
  );
}

export function getExistingCreatorChannelName(creator: ExistingCreator) {
  const fromParts = [creator.firstName, creator.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Prefer the account name so Creator + Channel stay aligned after web edits.
  // Fall back to stored channel/company when name fields are empty.
  return (
    fromParts ||
    creator.fullName?.trim() ||
    creator.channelName?.trim() ||
    creator.companyName?.trim() ||
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
