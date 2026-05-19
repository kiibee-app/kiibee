import type { ReactNode } from "react";
import type { ImageSource } from "@/utils/Constants";

export type SingleContentMetaItem = {
  label: string;
  value: ReactNode;
};

export type SingleContentHeroProps = {
  image: ImageSource;
  imageAlt: string;
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
