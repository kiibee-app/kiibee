import type { TFunction } from "i18next";
import logo from "@/assets/images/logo.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import { VARIANT } from "@/utils/Constants";
import type { SingleContentBodyProps } from "@/types/contentTypes";
import type { SingleContentHeroProps } from "@/types/contentTypes";
import type { RentedMediaItem } from "@/utils/dummyData/viewerRentedMockData";
import {
  PURCHASED_MEDIA_TYPES,
  type PurchasedCollectionItem,
  type PurchasedMediaItem,
  type PurchasedMediaType,
} from "@/utils/dummyData/viewerPurchasedMockData";
import { FORMAT_TYPE, type TutorialVideo } from "@/utils/types";

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

export type PurchasedMediaDetailView = {
  hero: SingleContentHeroProps;
  body: Pick<
    SingleContentBodyProps,
    | "creator"
    | "statusLabel"
    | "title"
    | "descriptions"
    | "primaryAction"
    | "metaItems"
  >;
};

export function toPurchasedMediaType(
  type: RentedMediaItem["mediaType"],
): PurchasedMediaType {
  return type as PurchasedMediaType;
}

export function rentedMediaToPurchasedItem(
  item: RentedMediaItem,
): PurchasedMediaItem {
  return {
    id: item.id,
    mediaType: toPurchasedMediaType(item.mediaType),
    category: item.category,
    thumbSrc: item.thumbSrc,
    title: item.title,
    author: item.author,
    dateLabel: item.expiryText,
  };
}

export function purchasedMediaToTutorial(
  item: PurchasedMediaItem,
): TutorialVideo {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    creator: item.author,
    published: item.dateLabel,
    focus: "",
    level: "",
    formatLabel: LABEL[item.mediaType],
    formatType: FORMAT[item.mediaType],
    image: item.thumbSrc,
    buttons: [
      {
        label: ACTION[item.mediaType],
        variant: VARIANT.SECONDARY,
      },
    ],
  };
}

export function getPurchasedMediaDetailView(
  item: PurchasedMediaItem,
  collection: PurchasedCollectionItem,
  t: TFunction,
): PurchasedMediaDetailView {
  const tutorial = purchasedMediaToTutorial(item);
  const playLabel =
    tutorial.buttons?.[0]?.label ?? t("singleTutorial.playTrailer");
  const isPdf = item.mediaType === PURCHASED_MEDIA_TYPES.PDF;

  return {
    hero: {
      image: item.thumbSrc,
      imageAlt: item.title,
      ...(isPdf
        ? {
            media: {
              type: FORMAT_TYPE.PDF,
              src: "",
              title: item.title,
            },
          }
        : {
            mediaIcon: playCircleIcon,
            mediaIconAlt: tutorial.formatLabel,
          }),
      categoryLabel: item.category,
      mediaLabel: tutorial.formatLabel,
      ...(isPdf
        ? {}
        : {
            trailerLabel: playLabel,
            trailerIcon: playIcon,
            trailerIconAlt: playLabel,
          }),
    },
    body: {
      creator: {
        name: item.author,
        avatar: logo,
      },
      statusLabel: "Owned",
      title: item.title,
      descriptions: collection.descriptionLines,
      primaryAction: {
        label: playLabel,
        disabled: true,
      },
      metaItems: [
        {
          label: t("singleTutorial.meta.publishedLabel"),
          value: item.dateLabel,
        },
        {
          label: t("singleTutorial.meta.publishedByLabel"),
          value: item.author,
        },
      ],
    },
  };
}
