import {
  AudioFileIcon,
  EpubIcon,
  PdfFileIcon,
  VideoIcon,
} from "@/assets/icons";
import { VIEWER_SIGNUP_PREFERENCE } from "@/utils/translationKeys";

export const PREF_STEP = {
  INTRO: "intro",
  CONTENT: "content",
  TYPES: "types",
} as const;

export type ViewerPreferenceStep = (typeof PREF_STEP)[keyof typeof PREF_STEP];

export const CONTENT_CATEGORY_OPTIONS = [
  {
    key: "comedy",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option("comedy"),
  },
  {
    key: "music",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option("music"),
  },
  {
    key: "podcasts",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option("podcasts"),
  },
  {
    key: "artsAndIllustration",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option(
      "artsAndIllustration",
    ),
  },
  {
    key: "booksAndWriting",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option("booksAndWriting"),
  },
  {
    key: "wellnessAndMindfulness",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option(
      "wellnessAndMindfulness",
    ),
  },
  {
    key: "educationAndLearning",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option(
      "educationAndLearning",
    ),
  },
  {
    key: "lifestyleAndVlogs",
    translationKey:
      VIEWER_SIGNUP_PREFERENCE.content.option("lifestyleAndVlogs"),
  },
  {
    key: "cookingAndFood",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option("cookingAndFood"),
  },
  {
    key: "sportsAndFitness",
    translationKey: VIEWER_SIGNUP_PREFERENCE.content.option("sportsAndFitness"),
  },
] as const;

export const CONTENT_TYPE_ITEMS = [
  {
    key: "video",
    icon: VideoIcon,
    translationKey: VIEWER_SIGNUP_PREFERENCE.types.option("video"),
  },
  {
    key: "audio",
    icon: AudioFileIcon,
    translationKey: VIEWER_SIGNUP_PREFERENCE.types.option("audio"),
  },
  {
    key: "pdf",
    icon: PdfFileIcon,
    translationKey: VIEWER_SIGNUP_PREFERENCE.types.option("pdf"),
  },
  {
    key: "epub",
    icon: EpubIcon,
    translationKey: VIEWER_SIGNUP_PREFERENCE.types.option("epub"),
  },
] as const;
