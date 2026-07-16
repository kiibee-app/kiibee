import type { ChannelLinkProps } from "../../types/channel-link";
import {
  CREATOR_ID_QUERY_PARAM,
  CREATOR_LAYOUT_KEY_TO_PARAM,
  CREATOR_LAYOUT_PARAM,
  CREATOR_PROFILE_PATH,
  DEFAULT_WEB_APP_URL,
} from "../../utils/constants";
import { existingCreatorLabels } from "../../utils/existingCreatorsConfig";

function resolveWebBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_WEB_URL?.trim() || DEFAULT_WEB_APP_URL;
  return raw.replace(/\/+$/, "");
}

function resolveLayoutParam(layout?: string | null): string {
  if (!layout?.trim()) {
    return CREATOR_LAYOUT_PARAM.LAYOUT1;
  }

  return (
    CREATOR_LAYOUT_KEY_TO_PARAM[layout.trim()] ?? CREATOR_LAYOUT_PARAM.LAYOUT1
  );
}

export function getPublicCreatorChannelUrl(
  creatorId: string,
  layout?: string | null,
): string {
  const params = new URLSearchParams({ [CREATOR_ID_QUERY_PARAM]: creatorId });
  return `${resolveWebBaseUrl()}${CREATOR_PROFILE_PATH}/${resolveLayoutParam(layout)}?${params.toString()}`;
}

export function ChannelLink({
  creatorId,
  channelName,
  companyName,
  layout,
  fallbackLabel = existingCreatorLabels.noChannel,
  onClick,
  children,
  className,
}: ChannelLinkProps) {
  const channelUrl = getPublicCreatorChannelUrl(creatorId, layout);
  const displayName = channelName || companyName;

  if (!displayName) {
    return <>{children || fallbackLabel}</>;
  }

  return (
    <a
      href={channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
      style={{
        color: "inherit",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = "underline";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = "none";
      }}
    >
      {children || displayName}
    </a>
  );
}
