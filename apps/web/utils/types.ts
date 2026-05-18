import type { ImageSource, Variant } from "@/utils/Constants";
import type { ButtonSize } from "@/components/UI/GenericButton/variants";
import { StaticImageData } from "next/image";

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
  fullWidth?: boolean;
  size?: ButtonSize;
  minWidth?: string;
};

export type TutorialVideo = {
  id: string;
  title: string;
  category: string;
  creator: string;
  published: string;
  focus: string;
  level: string;
  formatLabel: string;
  formatType?: FormatType;
  buttons?: TutorialButton[];
  image: ImageSource;
};

export type TutorialVideoSection = {
  id: string;
  title: string;
  videoIds: string[];
  gridMaxWidth?: string;
};

export type LayoutCardConfig = {
  key: string;
  titleKey: string;
  captionKey: string;
  image: string | StaticImageData;
};
export type Layout1CollectionMediaType =
  | (typeof FORMAT_TYPE)["VIDEO"]
  | (typeof FORMAT_TYPE)["PDF"]
  | (typeof FORMAT_TYPE)["EPUB"]
  | (typeof FORMAT_TYPE)["WEB"];

export type Layout1CollectionAction = {
  label: string;
};

export type Layout1CollectionCard = {
  id: string;
  badge: string;
  title: string;
  author: string;
  published: string;
  mediaType: Layout1CollectionMediaType;
  mediaLabel: string;
  image: string | StaticImageData;
  actions: Layout1CollectionAction[];
};

export type Layout1CollectionSection = {
  id: string;
  title: string;
  cards: Layout1CollectionCard[];
};
