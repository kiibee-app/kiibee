import { MonoText } from "@/components/UI/Monotext";
import type { Layout1CollectionMediaType } from "@/utils/types";
import { MEDIA_ICON_BY_TYPE } from "@/utils/mediaIconMap";
import { MetaPill } from "./styles";

type MediaMetaProps = {
  mediaType: Layout1CollectionMediaType;
  mediaLabel: string;
};

export default function MediaMeta({ mediaType, mediaLabel }: MediaMetaProps) {
  return (
    <MetaPill>
      {MEDIA_ICON_BY_TYPE[mediaType]}
      <MonoText $use="Body_Bold">{mediaLabel}</MonoText>
    </MetaPill>
  );
}
