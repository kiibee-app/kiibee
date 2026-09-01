export const creatorContentEngagementLabels = {
  loadingDetails: "Loading content details…",
  loadDetailsFailed: "Failed to load content details.",
  previewLoadFailed: "Failed to load preview.",
  backToCreator: "Back to creator",
  fallbackContentType: "Content",
  published: "Published",
  draft: "Draft",
  playContent: "Play content",
  loadingPreview: "Loading…",
  rejectContent: "Reject",
  rejectModalTitle: "Reject content",
  rejectModalDescription: (title: string) =>
    `This will permanently delete “${title}” and email the creator with your reason. This cannot be undone.`,
  rejectReasonLabel: "Reason",
  rejectReasonPlaceholder: "Explain why this content is being rejected…",
  rejectCancel: "Cancel",
  rejectConfirm: "Reject & delete",
  rejecting: "Rejecting…",
  rejectSuccess: "Content rejected and deleted.",
  rejectFailed: "Failed to reject content.",
  purchased: "Purchased",
  emailRegistered: "Registered Email",
  rented: "Rented",
  downloads: "Downloads",
  purchasedTab: "Purchased",
  emailRegisteredTab: "Registered Email",
  rentedTab: "Rented",
  downloadedTab: "Downloaded",
  whoPurchased: "Who Purchased",
  whoRegisteredEmail: "Who Registered Email",
  whoRented: "Who Rented",
  whoDownloaded: "Who Downloaded",
  noPurchases: "No purchases yet.",
  noEmailRegistrations: "No registered emails yet.",
  noRentals: "No rentals yet.",
  noDownloads: "No downloads yet.",
  tabsAriaLabel: "Content engagement sections",
} as const;

export const creatorContentEngagementLayout = {
  heroThumbWidth: 100,
  heroThumbHeight: 134,
  heroThumbRadius: 12,
} as const;

export const creatorContentEngagementValues = {
  paidAccessType: "paid",
} as const;

export const CONTENT_ACCESS_TYPES = {
  EMAIL_GATED: "email_gated",
  REQUEST_EMAIL: "request_email",
  PAID: "paid",
  FREE: "free",
} as const;

export const STAT_BADGE_VARIANTS = {
  BUY: "buy",
  RENT: "rent",
  DOWNLOAD: "download",
} as const;

export function isEmailGatedAccessType(accessType?: string | null): boolean {
  return (
    accessType === CONTENT_ACCESS_TYPES.EMAIL_GATED ||
    accessType === CONTENT_ACCESS_TYPES.REQUEST_EMAIL
  );
}

export const creatorContentGridLabels = {
  emptyState: "No content found.",
  fallbackContentType: "Content",
  boughtSuffix: "bought",
  emailRegisteredSuffix: "email registered",
  rentedSuffix: "rented",
  downloadSuffix: "download",
  downloadsSuffix: "downloads",
} as const;

export function getPurchaseStatSuffix(accessType?: string | null): string {
  if (isEmailGatedAccessType(accessType)) {
    return creatorContentGridLabels.emailRegisteredSuffix;
  }
  return creatorContentGridLabels.boughtSuffix;
}

export const contentPreviewLabels = {
  loadingPreview: "Loading preview…",
  noPreview: "No preview available.",
  openEpubFile: "Open EPUB file",
  openInNewTab: "Open in new tab",
  iframeBlocked:
    "This link cannot play inside the admin modal. It opened in a new tab.",
  noWebLink: "No web link available for this content.",
  noMediaFile: "No media file available for preview.",
  failedMediaPreviewUrl: "Failed to load media preview URL.",
} as const;
