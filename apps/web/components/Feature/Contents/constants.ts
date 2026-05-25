import {
  AdmissionRequirementValue,
  ADMISSION_REQUIREMENT_VALUES,
} from "@/utils/admissionRequirements";
import { ContentFormState } from "./ContentFormContext";

export const CONTENT_TYPE_FALLBACK = "video";
export const ADMISSION_REQUIREMENT_PAYMENT = "Payment";
export const ADMISSION_REQUIREMENT_FREE = "Free";
export const ACCESS_TYPE_PAID = "paid";
export const ACCESS_TYPE_FREE = "free";
export const ACCESS_TYPE_PASSWORD = "password";
export const ACCESS_TYPE_EMAIL_GATED = "email_gated";
export const VISIBILITY_PUBLIC_LOWER = "public";
export const VISIBILITY_PUBLIC_UPPER = "Public";
export const VISIBILITY_HIDDEN_LOWER = "hidden";
export const VISIBILITY_HIDDEN_UPPER = "Hidden";
export const CATEGORY_EDUCATION_LOWER = "education";
export const RENT_DURATION_DEFAULT = 48;
export const DOWNLOAD_LIMIT_UNLIMITED = "Unlimited";
export const DOWNLOAD_LIMIT_DEFAULT = "5";

export const CONTENT_TYPE_VIDEO = "video";
export const CONTENT_TYPE_AUDIO = "audio";
export const CONTENT_TYPE_PDF = "pdf";
export const CONTENT_TYPE_EPUB = "epub";

export const MIME_TYPE_VIDEO_MP4 = "video/mp4";
export const MIME_TYPE_APPLICATION_PDF = "application/pdf";

export const ERROR_MESSAGES = {
  NO_CONTENT: "No content to save",
  SAVE_CHANGES_FAILED: "Failed to save changes",
  SAVE_SETTINGS_FAILED: "Failed to save settings",
  LOAD_DETAILS_FAILED: "Failed to load content details",
};

export const UI_TITLE_FALLBACK = "Content Details";

export const apiToUiAccessTypeMap: Record<string, AdmissionRequirementValue> = {
  [ACCESS_TYPE_PASSWORD]: ADMISSION_REQUIREMENT_VALUES.password,
  [ACCESS_TYPE_EMAIL_GATED]: ADMISSION_REQUIREMENT_VALUES.email,
  [ACCESS_TYPE_PAID]: ADMISSION_REQUIREMENT_VALUES.password,
  [ACCESS_TYPE_FREE]: ADMISSION_REQUIREMENT_VALUES.free,
};

export const uiToApiAccessTypeMap: Record<
  string,
  "free" | "paid" | "password" | "email_gated"
> = {
  [ADMISSION_REQUIREMENT_VALUES.password]: ACCESS_TYPE_PASSWORD,
  [ADMISSION_REQUIREMENT_VALUES.email]: ACCESS_TYPE_EMAIL_GATED,
  [ADMISSION_REQUIREMENT_VALUES.free]: ACCESS_TYPE_FREE,
};

export const contentTypeMimeMap: Record<string, string> = {
  [CONTENT_TYPE_VIDEO]: MIME_TYPE_VIDEO_MP4,
  [CONTENT_TYPE_PDF]: MIME_TYPE_APPLICATION_PDF,
};

export const contentTypeSizeMap: Record<string, number> = {
  [CONTENT_TYPE_VIDEO]: 1.2 * 1024 * 1024 * 1024,
  [CONTENT_TYPE_AUDIO]: 45 * 1024 * 1024,
  [CONTENT_TYPE_PDF]: 4.5 * 1024 * 1024,
  [CONTENT_TYPE_EPUB]: 4.5 * 1024 * 1024,
};

export const mockSizeFallback = 12 * 1024 * 1024;

export function buildContentUpdatePayload(formState: ContentFormState) {
  return {
    title: formState.title,
    description: formState.description,
    trailerUrl: formState.trailerLink || undefined,
    thumbnailUrl: formState.mediaCardThumbnail || undefined,
    thumbnailLandscapeUrl: formState.portraitThumbnail || undefined,
    publishedYear: formState.publishedYear
      ? parseInt(formState.publishedYear)
      : undefined,
    duration: formState.duration ? parseInt(formState.duration) : undefined,
    categoryId: formState.category
      ? formState.category.toLowerCase()
      : undefined,
    productionCompany: formState.productionCompany || undefined,
    manufacturerLink: formState.manufacturerLink || undefined,
    visibility: formState.visibility
      ? formState.visibility.toLowerCase()
      : undefined,
    accessType: formState.admissionRequirement
      ? formState.admissionRequirement.toLowerCase() ===
        ADMISSION_REQUIREMENT_PAYMENT.toLowerCase()
        ? ACCESS_TYPE_PAID
        : ACCESS_TYPE_FREE
      : undefined,
    buyPrice: formState.purchaseAmount
      ? parseFloat(formState.purchaseAmount)
      : undefined,
    rentPrice: formState.rentalAmount
      ? parseFloat(formState.rentalAmount)
      : undefined,
    rentDurationHours: formState.rentalAmount
      ? RENT_DURATION_DEFAULT
      : undefined,
    maximumDownloadCount:
      formState.maxDownloadLimit &&
      formState.maxDownloadLimit !== DOWNLOAD_LIMIT_UNLIMITED
        ? parseInt(formState.maxDownloadLimit)
        : undefined,
    physicalProductLink: formState.physicalProductLink || undefined,
  };
}
