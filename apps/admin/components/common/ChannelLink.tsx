import type { ChannelLinkProps } from "../../types/channel-link";

export function ChannelLink({
  creatorId,
  channelName,
  companyName,
  fallbackLabel = "No Channel",
  onClick,
  children,
  className,
}: ChannelLinkProps) {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const channelUrl = `${webUrl}/creator/1?creatorId=${creatorId}`;
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
