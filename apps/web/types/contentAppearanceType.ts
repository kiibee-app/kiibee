import type { CreatorLayoutKey } from "@/utils/creatorChannel";

export type ContentAppearanceEntity = {
  id?: string;
  userId?: string;
  textColor?: string | null;
  buttonColor?: string | null;
  logoType?: string | null;
  logoName?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  layout?: CreatorLayoutKey | null;
  desktopCoverImageUrl?: string | null;
  mobileCoverImageUrl?: string | null;
  receipt?: string | null;
  supportEmail?: string | null;
};

export type ContentAppearanceResponse = {
  success?: boolean;
  message?: string;
  data?: ContentAppearanceEntity | null;
};

export type ContentAppearancePayload = {
  textColor?: string;
  buttonColor?: string;
  logoType?: string;
  logoName?: string;
  logoUrl?: string | null;
  description?: string;
  layout?: CreatorLayoutKey;
  desktopCoverImageUrl?: string | null;
  mobileCoverImageUrl?: string | null;
  receipt?: string;
  supportEmail?: string;
};
