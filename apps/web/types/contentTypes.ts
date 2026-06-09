import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { ImageSource, Variant } from "@/utils/Constants";
import type { ContentType } from "@/utils/content";

export type SingleContentMetaItem = {
  label: string;
  value: ReactNode;
};

export type SingleContentAction = {
  label: string;
  subtitle?: string;
  variant?: Variant;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type SingleContentHeroProps = {
  image: ImageSource;
  imageAlt: string;
  media?: {
    type: ContentType;
    src: string;
    title: string;
  };
  categoryLabel?: string;
  mediaLabel?: string;
  mediaIcon?: ImageSource;
  mediaIconAlt?: string;
  trailerLabel?: string;
  trailerIcon?: ImageSource;
  trailerIconAlt?: string;
  onTrailerClick?: () => void;
};

export type SingleContentPageProps = {
  title: string;
  descriptions?: string[];
  tags?: string[];
  statusLabel?: string;
  expiry?: {
    label: string;
    tone?: "default" | "urgent";
  };
  creator?: {
    name: string;
    avatar?: ImageSource;
    avatarAlt?: string;
  };
  hero: SingleContentHeroProps;
  primaryAction?: SingleContentAction;
  primaryActions?: SingleContentAction[];
  metaItems?: SingleContentMetaItem[];
  shareLabel?: string;
  showShare?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  children?: ReactNode;
};

export type SingleContentTopBarProps = {
  showBack: boolean;
  showShare: boolean;
  shareLabel: string;
  onBackClick: () => void;
  onShare?: () => void;
};

export type SingleContentHeroSectionProps = {
  hero: SingleContentHeroProps;
};

export type SingleContentCreatorProps = {
  creator: NonNullable<SingleContentPageProps["creator"]>;
};

export type SingleContentBodyProps = Pick<
  SingleContentPageProps,
  | "creator"
  | "statusLabel"
  | "title"
  | "descriptions"
  | "tags"
  | "primaryAction"
  | "primaryActions"
  | "expiry"
  | "metaItems"
>;

export type ContentFormState = {
  title: string;
  description: string;
  trailerLink: string;
  visibility: string;
  publishedYear: string;
  duration: string;
  category: string;
  productionCompany: string;
  manufacturerLink: string;
  tags: string;
  mediaCardThumbnail: string | null;
  portraitThumbnail: string | null;
  admissionRequirement: string;
  rentalAmount: string;
  purchaseAmount: string;
  maxDownloadLimit: string;
  physicalProductLink: string;
  contentTypeId?: ContentType;
  webLink?: string;
  openInNewWindow?: boolean;
  openDirectFromList?: boolean;
};

export type ContentFormErrorKey =
  | "title"
  | "description"
  | "publishedYear"
  | "duration"
  | "category"
  | "productionCompany"
  | "manufacturerLink"
  | "tags"
  | "mediaCardThumbnail"
  | "portraitThumbnail";

export type ContentFormErrors = Partial<Record<ContentFormErrorKey, string>>;

export const defaultState: ContentFormState = {
  title: "",
  description: "",
  trailerLink: "",
  visibility: "Public",
  publishedYear: "",
  duration: "",
  category: "education",
  productionCompany: "",
  manufacturerLink: "",
  tags: "",
  mediaCardThumbnail: null,
  portraitThumbnail: null,
  admissionRequirement: "Payment",
  rentalAmount: "",
  purchaseAmount: "",
  maxDownloadLimit: "5",
  physicalProductLink: "",
  openInNewWindow: false,
  openDirectFromList: false,
  webLink: "",
};

export type ContentFormContextType = {
  formState: ContentFormState;
  savedFormState: ContentFormState;
  formErrors: ContentFormErrors;
  setFormState: Dispatch<SetStateAction<ContentFormState>>;
  setSavedFormState: Dispatch<SetStateAction<ContentFormState>>;
  setFormErrors: Dispatch<SetStateAction<ContentFormErrors>>;
  updateField: <K extends keyof ContentFormState>(
    field: K,
    value: ContentFormState[K],
  ) => void;
  setFieldError: (field: ContentFormErrorKey, message: string) => void;
  clearFieldError: (field: ContentFormErrorKey) => void;
  clearFormErrors: () => void;
  markFormAsSaved: (nextState?: ContentFormState) => void;
  prefillForm: (file: File | null) => void;
  resetForm: () => void;
};
