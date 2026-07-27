export type CreatorAppearanceSectionMeta = {
  title: string;
  hint: string;
};

export const CREATOR_APPEARANCE_SECTIONS = [
  {
    title: "Layout",
    hint: "Choose which channel layout viewers see on the public profile.",
  },
  {
    title: "Colors",
    hint: "Text and button colors for the channel.",
  },
  {
    title: "Logo",
    hint: "Use channel name text or upload a logo image.",
  },
  {
    title: "Description",
    hint: "Shown on the creator channel profile.",
  },
  {
    title: "Cover images",
    hint: "Replace desktop or mobile covers if the current images look wrong.",
  },
  {
    title: "Receipt",
    hint: "Receipt message and support contact email.",
  },
] as const satisfies readonly CreatorAppearanceSectionMeta[];
