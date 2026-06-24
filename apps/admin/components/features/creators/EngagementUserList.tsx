import type { ContentEngagementUser } from "../../../types/creator-content";
import { getViewerInitials } from "../../../utils/viewersConfig";
import { EmptyState } from "../viewers/Viewers.styles";
import {
  EngagementAvatar,
  EngagementDate,
  EngagementEmail,
  EngagementItem,
  EngagementList,
  EngagementMain,
  EngagementMeta,
  EngagementName,
  EngagementSubDate,
} from "./Creators.styles";

type EngagementUserListProps = {
  users: ContentEngagementUser[];
  emptyMessage: string;
  showExpiry?: boolean;
};

export function EngagementUserList({
  users,
  emptyMessage,
  showExpiry,
}: EngagementUserListProps) {
  if (!users.length) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <EngagementList>
      {users.map((user) => (
        <EngagementItem key={user.id}>
          <EngagementAvatar>{getViewerInitials(user.name)}</EngagementAvatar>
          <EngagementMain>
            <EngagementName>{user.name}</EngagementName>
            <EngagementEmail>{user.email}</EngagementEmail>
          </EngagementMain>
          <EngagementMeta>
            <EngagementDate>{user.displayDate}</EngagementDate>
            {showExpiry && user.rentExpiresDisplay ? (
              <EngagementSubDate>
                Expires {user.rentExpiresDisplay}
              </EngagementSubDate>
            ) : null}
          </EngagementMeta>
        </EngagementItem>
      ))}
    </EngagementList>
  );
}
