import type { ImageSource, Variant } from "@/utils/Constants";
import type { ButtonSize } from "@/components/UI/GenericButton/variants";
import { StaticImageData } from "next/image";
import type { CreatorLayoutKey } from "./creatorChannel";

export const FORMAT_TYPE = {
  VIDEO: "video",
  AUDIO: "audio",
  PDF: "pdf",
  EPUB: "epub",
  WEB: "web",
} as const;

export type FormatType = (typeof FORMAT_TYPE)[keyof typeof FORMAT_TYPE];

export type TutorialButton = {
  label: string;
  variant?: Variant;
  href?: string;
  requiresAuth?: boolean;
  fullWidth?: boolean;
  size?: ButtonSize;
  minWidth?: string;
  onClick?: () => void;
};

export type TutorialVideo = {
  id: string;
  title: string;
  category: string;
  creator: string;
  creatorId?: string;
  published: string;
  focus: string;
  level: string;
  isFree?: boolean;
  formatLabel: string;
  formatType?: FormatType;
  buttons?: TutorialButton[];
  image: ImageSource;
  imageFallback?: string;
};

export type TutorialVideoSection = {
  id: string;
  title: string;
  videoIds: string[];
  gridMaxWidth?: string;
};

export type LayoutCardConfig = {
  key: CreatorLayoutKey;
  titleKey: string;
  captionKey: string;
  image: string | StaticImageData;
};
