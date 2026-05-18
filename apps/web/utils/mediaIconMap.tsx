import type { ReactNode } from "react";
import { EpubIcon, PdfFileIcon, VideoIcon, WebIcon } from "@/assets/icons";
import COLORS from "@repo/ui/colors";
import { FORMAT_TYPE } from "@/utils/types";
import type { Layout1CollectionMediaType } from "@/utils/types";

const ICON_SIZE = 18;
const MEDIA_ICON_COLOR = COLORS.neutral.BLACK;

export const MEDIA_ICON_BY_TYPE: Record<Layout1CollectionMediaType, ReactNode> =
  {
    [FORMAT_TYPE.VIDEO]: (
      <VideoIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={MEDIA_ICON_COLOR}
      />
    ),
    [FORMAT_TYPE.PDF]: (
      <PdfFileIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={MEDIA_ICON_COLOR}
      />
    ),
    [FORMAT_TYPE.EPUB]: (
      <EpubIcon width={ICON_SIZE} height={ICON_SIZE} color={MEDIA_ICON_COLOR} />
    ),
    [FORMAT_TYPE.WEB]: (
      <WebIcon width={ICON_SIZE} height={ICON_SIZE} color={MEDIA_ICON_COLOR} />
    ),
  };
