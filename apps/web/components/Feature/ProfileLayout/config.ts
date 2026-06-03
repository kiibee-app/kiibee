import type { CreatorLayoutParam } from "@/utils/creatorChannel";
import type { LatestUploadData } from "@/components/Feature/ProfileLayout/shared/LatestUpload";

export type ProfileLayoutVariant = CreatorLayoutParam;
import { PROFILE_HOME_SECTION, ProfileHomeSectionKey } from "@/utils/Constants";
import {
  latestUploadDataLayout1,
  latestUploadDataLayout2,
  latestUploadDataLayout3,
} from "@/utils/dummyData/lastestUpload.data";

export type ProfileHomeConfig = {
  latestUpload: LatestUploadData;
  wrapLatestUpload?: boolean;
  sections: readonly ProfileHomeSectionKey[];
};

export const profileHomeConfigByVariant: Record<
  ProfileLayoutVariant,
  ProfileHomeConfig
> = {
  "1": {
    latestUpload: latestUploadDataLayout1,
    wrapLatestUpload: true,
    sections: [
      PROFILE_HOME_SECTION.LATEST_UPLOAD,
      PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW,
    ],
  },
  "2": {
    latestUpload: latestUploadDataLayout2,
    sections: [
      PROFILE_HOME_SECTION.LATEST_UPLOAD,
      PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW,
    ],
  },
  "3": {
    latestUpload: latestUploadDataLayout3,
    sections: [
      PROFILE_HOME_SECTION.LATEST_UPLOAD,
      PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW,
    ],
  },
};
