import type { Viewer } from "../types/viewer";

export const viewerTableColumns = [
  "Viewer",
  "Joined",
  "Location",
  "Activity",
  "Status",
  "Verified",
] as const;

export const viewerLabels = {
  avatarFallback: "VW",
  notProvided: "Not provided",
  purchases: "purchases",
  rentals: "rentals",
  verified: "Verified",
  unverified: "Unverified",
} as const;

export function getViewerDisplayName(viewer: Viewer) {
  return (
    viewer.fullName?.trim() ||
    [viewer.firstName, viewer.lastName].filter(Boolean).join(" ").trim() ||
    viewer.email
  );
}

export function getViewerInitials(name: string) {
  const [first = "", second = ""] = name.trim().split(/\s+/);
  return (
    `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase() ||
    viewerLabels.avatarFallback
  );
}

export function formatViewerStatus(status: string) {
  return status.replaceAll("-", " ");
}
