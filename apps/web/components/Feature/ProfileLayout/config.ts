import type { CreatorLayoutParam } from "@/utils/creatorChannel";
import type { LatestUploadData } from "@/components/Feature/ProfileLayout/shared/LatestUpload";

export type ProfileLayoutVariant = CreatorLayoutParam;
import { ProfileHomeSectionKey } from "@/utils/Constants";
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
    sections: ["latestUpload"],
  },
  "2": {
    latestUpload: latestUploadDataLayout2,
    sections: ["latestUpload", "about"],
  },
  "3": {
    latestUpload: latestUploadDataLayout3,
    sections: ["latestUpload"],
  },
};
