export type CreatorLayoutKey = "layout1" | "layout2" | "layout3";

export type LogoType = "text" | "picture";

export type ContentAppearance = {
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

export type ContentAppearancePayload = {
  textColor: string;
  buttonColor: string;
  logoType: LogoType;
  logoName: string;
  logoUrl: string | null;
  description: string;
  layout: CreatorLayoutKey;
  desktopCoverImageUrl: string | null;
  mobileCoverImageUrl: string | null;
  receipt: string;
  supportEmail: string;
};

export type AppearanceFormValues = {
  textColor: string;
  buttonColor: string;
  buttonHex: string;
  logoType: LogoType;
  logoName: string;
  logoUrl: string | null;
  description: string;
  receipt: string;
  supportEmail: string;
  desktopCoverImageUrl: string | null;
  mobileCoverImageUrl: string | null;
  layout: CreatorLayoutKey;
};
