import type { StaticImageData } from "next/image";
import type { Variant } from "@/utils/Constants";
import type { ButtonSize } from "@/components/UI/GenericButton/styles";

export type FormatType = "video" | "pdf" | "epub" | "web";

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
  image: string | StaticImageData;
};
