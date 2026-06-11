"use client";

import type { ExistingCreator } from "../../../types/existing-creator";
import { formatRequestedAt } from "../../../utils/date";
import {
  existingCreatorLabels,
  existingCreatorTableColumns,
  formatExistingCreatorStatus,
  getExistingCreatorDisplayName,
  getExistingCreatorInitials,
} from "../../../utils/existingCreatorsConfig";
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
};

export function ExistingCreatorsTable({
  creators,
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

            return (
              <RequestTableRow key={creator.id}>
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
                    <CreatorName>
                      {creator.channelName ||
                        creator.companyName ||
                        existingCreatorLabels.noChannel}
                    </CreatorName>
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
