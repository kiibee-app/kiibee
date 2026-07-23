"use client";

import type { ExistingCreator } from "../../../types/existing-creator";
import { formatRequestedAt } from "../../../utils/date";
import {
  existingCreatorLabels,
  existingCreatorTableColumns,
  formatExistingCreatorStatus,
  getExistingCreatorChannelName,
  getExistingCreatorDisplayName,
  getExistingCreatorInitials,
} from "../../../utils/existingCreatorsConfig";
import { ChannelLink } from "../../common/ChannelLink";
import {
  AccountStatusBadge,
  CreatorAvatar,
  CreatorAvatarImage,
  CreatorCell,
  CreatorIdentity,
  CreatorName,
  MetricGroup,
  MiniText,
  PublicationBadge,
  RequestsTable,
  RequestTableRow,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "./AllCreators.styles";

type ExistingCreatorsTableProps = {
  creators: ExistingCreator[];
  onSelectCreator?: (creator: ExistingCreator) => void;
};

export function ExistingCreatorsTable({
  creators,
  onSelectCreator,
}: ExistingCreatorsTableProps) {
  return (
    <TableScrollWrapper>
      <RequestsTable>
        <thead>
          <tr>
            {existingCreatorTableColumns.map((column) => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {creators.map((creator) => {
            const displayName = getExistingCreatorDisplayName(creator);
            const channelDisplayName =
              getExistingCreatorChannelName(creator) ||
              existingCreatorLabels.noChannel;

            return (
              <RequestTableRow
                key={creator.id}
                onClick={() => onSelectCreator?.(creator)}
                style={{ cursor: onSelectCreator ? "pointer" : "default" }}
              >
                <TableBodyCell>
                  <CreatorIdentity>
                    <CreatorAvatar>
                      {creator.avatarUrl ? (
                        <CreatorAvatarImage
                          src={creator.avatarUrl}
                          alt={displayName}
                        />
                      ) : (
                        getExistingCreatorInitials(displayName)
                      )}
                    </CreatorAvatar>
                    <CreatorCell>
                      <CreatorName>{displayName}</CreatorName>
                      <MiniText>{creator.email}</MiniText>
                    </CreatorCell>
                  </CreatorIdentity>
                </TableBodyCell>
                <TableBodyCell>
                  {formatRequestedAt(creator.createdAt)}
                </TableBodyCell>
                <TableBodyCell>
                  {creator.city || existingCreatorLabels.notProvided}
                </TableBodyCell>
                <TableBodyCell>
                  <CreatorCell>
                    <ChannelLink
                      creatorId={creator.id}
                      channelName={creator.channelName}
                      companyName={
                        creator.companyName || creator.fullName || displayName
                      }
                      layout={creator.layout}
                      fallbackLabel={existingCreatorLabels.noChannel}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CreatorName>{channelDisplayName}</CreatorName>
                    </ChannelLink>
                    <MiniText>
                      {creator.channelSlug
                        ? `/${creator.channelSlug}`
                        : existingCreatorLabels.noSlug}
                    </MiniText>
                  </CreatorCell>
                </TableBodyCell>
                <TableBodyCell>
                  {creator.planName || existingCreatorLabels.noPlan}
                </TableBodyCell>
                <TableBodyCell>
                  <MetricGroup>
                    <MiniText>
                      {creator.uploadCount} {existingCreatorLabels.uploads}
                    </MiniText>
                    <MiniText>
                      {creator.subscriberCount}{" "}
                      {existingCreatorLabels.subscribers}
                    </MiniText>
                  </MetricGroup>
                </TableBodyCell>
                <TableBodyCell>
                  <AccountStatusBadge $status={creator.status}>
                    {formatExistingCreatorStatus(creator.status)}
                  </AccountStatusBadge>
                </TableBodyCell>
                <TableBodyCell>
                  <PublicationBadge $published={Boolean(creator.isPublished)}>
                    {creator.isPublished
                      ? existingCreatorLabels.published
                      : existingCreatorLabels.draft}
                  </PublicationBadge>
                </TableBodyCell>
              </RequestTableRow>
            );
          })}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}
