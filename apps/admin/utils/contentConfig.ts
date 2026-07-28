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
  rented: "Rented",
  downloads: "Downloads",
  purchasedTab: "Purchased",
  rentedTab: "Rented",
  downloadedTab: "Downloaded",
  whoPurchased: "Who Purchased",
  whoRented: "Who Rented",
  whoDownloaded: "Who Downloaded",
  noPurchases: "No purchases yet.",
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

export const creatorContentGridLabels = {
  emptyState: "No content found.",
  fallbackContentType: "Content",
  boughtSuffix: "bought",
  rentedSuffix: "rented",
  downloadsSuffix: "downloads",
} as const;

export const contentPreviewLabels = {
  loadingPreview: "Loading preview…",
  noPreview: "No preview available.",
  openEpubFile: "Open EPUB file",
  noWebLink: "No web link available for this content.",
  noMediaFile: "No media file available for preview.",
  failedMediaPreviewUrl: "Failed to load media preview URL.",
} as const;
