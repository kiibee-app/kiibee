import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { ImageSource } from "@/utils/Constants";
import type { ContentType } from "@/utils/content";

export type SingleContentMetaItem = {
  label: string;
  value: ReactNode;
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
  primaryAction?: {
    label: string;
    ariaLabel?: string;
    onClick?: () => void;
  };
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
  setFormState: Dispatch<SetStateAction<ContentFormState>>;
  updateField: <K extends keyof ContentFormState>(
    field: K,
    value: ContentFormState[K],
  ) => void;
  prefillForm: (file: File | null) => void;
  resetForm: () => void;
};
