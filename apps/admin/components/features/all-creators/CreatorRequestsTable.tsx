"use client";

import type { CreatorRequest } from "../../../types/creator-request";
import { formatRequestedAt } from "../../../utils/date";
import {
  Actions,
  Button,
  CreatorCell,
  CreatorName,
  MiniText,
  StatusBadge,
  Table,
  TableRow,
  Td,
  Th,
} from "./AllCreators.styles";

interface CreatorRequestsTableProps {
  creators: CreatorRequest[];
  onSelectCreator: (creator: CreatorRequest) => void;
}

export function CreatorRequestsTable({
  creators,
  onSelectCreator,
}: CreatorRequestsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Creator</Th>
          <Th>Email</Th>
          <Th>Requested At</Th>
          <Th>City</Th>
          <Th>Content Description</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {creators.map((creator) => {
          const showApprove = creator.status === "pending";
          const showReject =
            creator.status === "pending" || creator.status === "approved";

          return (
            <TableRow key={creator.id} onClick={() => onSelectCreator(creator)}>
              <Td>
                <CreatorCell>
                  <CreatorName>{creator.fullName}</CreatorName>
                  <MiniText>@{creator.city}</MiniText>
                </CreatorCell>
              </Td>
              <Td>{creator.email}</Td>
              <Td>{formatRequestedAt(creator.createdAt)}</Td>
              <Td>{creator.city}</Td>
              <Td>{creator.contentDescription}</Td>
              <Td>
                <StatusBadge $status={creator.status}>
                  {creator.status}
                </StatusBadge>
              </Td>
              <Td>
                <Actions>
                  {showApprove ? (
                    <Button
                      $variant="approve"
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Approve
                    </Button>
                  ) : null}
                  {showReject ? (
                    <Button
                      $variant="reject"
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Reject
                    </Button>
                  ) : null}
                </Actions>
              </Td>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
