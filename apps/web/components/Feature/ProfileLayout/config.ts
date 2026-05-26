import type { CreatorLayoutParam } from "@/utils/creatorChannel";
import type { LatestUploadData } from "@/components/Feature/ProfileLayout/shared/LatestUpload";

export type ProfileLayoutVariant = CreatorLayoutParam;
import { PROFILE_HOME_SECTION, ProfileHomeSectionKey } from "@/utils/Constants";

export type LatestUploadConfig = Pick<
  LatestUploadData,
  "sectionTitle" | "actions" | "imageStyle" | "containerStyle"
> & {
  badge?: string;
};

export type ProfileHomeConfig = {
  latestUpload: LatestUploadConfig;
  wrapLatestUpload?: boolean;
  sections: readonly ProfileHomeSectionKey[];
};

export const profileHomeConfigByVariant: Record<
  ProfileLayoutVariant,
  ProfileHomeConfig
> = {
  "1": {
    latestUpload: {
      sectionTitle: "Latest upload",
      badge: "Latest",
      actions: [
        { title: "Buy 99 kr", subtitle: "Download file" },
        { title: "Rent 50 kr", subtitle: "Access for 3 months" },
      ],
      imageStyle: {
        width: "376px",
        height: "530px",
        padding: "14px 295px 15px 14px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "445px",
      },
      containerStyle: {
        maxWidth: "100%",
        padding: "0",
      },
    },
    wrapLatestUpload: true,
    sections: [
      PROFILE_HOME_SECTION.LATEST_UPLOAD,
      PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW,
    ],
  },
  "2": {
    latestUpload: {
      sectionTitle: "Latest upload",
      badge: "Latest",
      actions: [{ title: "Rent 50 kr", subtitle: "Access for 3 months" }],
    },
    sections: [PROFILE_HOME_SECTION.LATEST_UPLOAD, PROFILE_HOME_SECTION.ABOUT],
  },
  "3": {
    latestUpload: {
      sectionTitle: "Latest upload",
      badge: "Latest",
      actions: [
        { title: "Buy 99 kr", subtitle: "Download file" },
        { title: "Buy collection 200 kr" },
      ],
    },
    sections: [PROFILE_HOME_SECTION.LATEST_UPLOAD],
  },
};
