import { MAX_DESCRIPTION_LENGTH } from "./appearance";

export const creatorAppearanceLabels = {
  fallbackCreatorName: "Creator",
  loading: "Loading creator appearance…",
  loadCreatorFailed: "Failed to load creator details.",
  loadAppearanceFailed: "Failed to load creator appearance settings.",
  backToDetails: "Back to creator details",
  eyebrow: "Channel appearance",
  pageTitle: "Update creator settings",
  cancel: "Cancel",
  save: "Save changes",
  saving: "Saving…",
  stickyHint: "Unsaved appearance changes",
  textColor: "Text color",
  buttonColor: "Button color",
  customButtonHex: "Custom button hex",
  hexPlaceholder: "#000000",
  logoText: "Text",
  logoPicture: "Picture",
  logoName: "Logo name",
  logoNamePlaceholder: "Channel name",
  logoImage: "Logo image",
  logoPreviewAlt: "Logo preview",
  noLogo: "No logo uploaded",
  uploadLogo: "Upload logo",
  remove: "Remove",
  channelDescription: "Channel description",
  descriptionPlaceholder: "Describe this creator channel",
  desktopCover: "Desktop cover",
  desktopCoverHint: "Recommended wide landscape image",
  desktopCoverAlt: "Desktop cover preview",
  noDesktopCover: "No desktop cover",
  uploadDesktop: "Upload desktop",
  mobileCover: "Mobile cover",
  mobileCoverHint: "Recommended taller mobile image",
  mobileCoverAlt: "Mobile cover preview",
  noMobileCover: "No mobile cover",
  uploadMobile: "Upload mobile",
  receiptMessage: "Receipt message",
  receiptPlaceholder: "Shown on purchase receipts",
  supportEmail: "Support email",
  supportEmailPlaceholder: "support@example.com",
  invalidImageFile: "Please select a valid image file.",
  readImageFailed: "Failed to read the selected image.",
  invalidHex: "Enter a valid hex color (e.g. #1a2b3c).",
  saveSuccess:
    "Creator appearance updated. Changes are live on the creator dashboard and public channel.",
  saveFailed: "Failed to update creator appearance.",
} as const;

export function getCreatorAppearanceSubtitle(displayName: string) {
  return `Edit layout, covers, and branding for ${displayName}. Changes sync to the creator dashboard and public profile.`;
}

export function getDescriptionMaxError(max: number = MAX_DESCRIPTION_LENGTH) {
  return `Description must be ${max} characters or fewer.`;
}
