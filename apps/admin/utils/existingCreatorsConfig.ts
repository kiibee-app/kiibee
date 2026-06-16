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
} as const;

export function getExistingCreatorDisplayName(creator: ExistingCreator) {
  return (
    creator.fullName?.trim() ||
    creator.companyName?.trim() ||
    creator.channelName?.trim() ||
    creator.email
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
