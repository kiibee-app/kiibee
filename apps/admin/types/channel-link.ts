import type { ReactNode } from "react";

export type ChannelLinkProps = {
  creatorId: string;
  channelName?: string | null;
  companyName?: string | null;
  fallbackLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
  className?: string;
};
