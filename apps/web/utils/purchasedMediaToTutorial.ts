import { VARIANT } from "@/utils/Constants";
import {
  FORMAT_TYPE,
  type TutorialButton,
  type TutorialVideo,
} from "@/utils/types";
import {
  PURCHASED_MEDIA_TYPES,
  type PurchasedMediaItem,
} from "@/utils/dummyData/viewerPurchasedMockData";

const ACTION: Record<PurchasedMediaItem["mediaType"], string> = {
  [PURCHASED_MEDIA_TYPES.VIDEO]: "Play video",
  [PURCHASED_MEDIA_TYPES.AUDIO]: "Play audio",
  [PURCHASED_MEDIA_TYPES.PDF]: "Open PDF",
};

const FORMAT: Record<
  PurchasedMediaItem["mediaType"],
  TutorialVideo["formatType"]
> = {
  [PURCHASED_MEDIA_TYPES.VIDEO]: FORMAT_TYPE.VIDEO,
  [PURCHASED_MEDIA_TYPES.AUDIO]: FORMAT_TYPE.AUDIO,
  [PURCHASED_MEDIA_TYPES.PDF]: FORMAT_TYPE.PDF,
};

const LABEL: Record<PurchasedMediaItem["mediaType"], string> = {
  [PURCHASED_MEDIA_TYPES.VIDEO]: "Video",
  [PURCHASED_MEDIA_TYPES.AUDIO]: "Audio",
  [PURCHASED_MEDIA_TYPES.PDF]: "PDF",
};

export type PurchasedMediaTutorialOptions = {
  published?: string;
  buttons?: TutorialButton[];
};

export function purchasedMediaToTutorial(
  item: PurchasedMediaItem,
  options?: PurchasedMediaTutorialOptions,
): TutorialVideo {
  const defaultButtons: TutorialButton[] = [
    {
      label: ACTION[item.mediaType],
      variant: VARIANT.SECONDARY,
    },
  ];

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    creator: item.author,
    published: options?.published ?? item.dateLabel,
    focus: "",
    level: "",
    formatLabel: LABEL[item.mediaType],
    formatType: FORMAT[item.mediaType],
    image: item.thumbSrc,
    buttons: options?.buttons ?? defaultButtons,
  };
}
