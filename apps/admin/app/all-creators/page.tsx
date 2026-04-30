"use client";

import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import creatorsResponse from "../../data/all-creator-requests.json";
import { Modal } from "../../components/common/Modal";

type CreatorStatus = "pending" | "approved" | "rejected";

type CreatorRequest = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  cvr: string;
  address: string;
  city: string;
  postalCode: string;
  exampleWorkLink: string;
  createdAt: string;
  updatedAt: string;
  contentDescription: string;
  status: CreatorStatus;
  approvedUserId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
};

type CreatorResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreatorRequest[];
};

const response = creatorsResponse as CreatorResponse;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  cursor: pointer;

  &:hover td {
    background: ${({ theme }) => theme.colors.bg.app};
  }
`;

const Th = styled.th`
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.main};
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.muted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CreatorCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.text.main};
  font-weight: 600;
`;

const MiniText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: CreatorStatus }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  ${({ $status, theme }) => {
    if ($status === "approved") {
      return css`
        background: ${theme.colors.brand.lightest};
        color: ${theme.colors.brand.dark};
      `;
    }

    if ($status === "rejected") {
      return css`
        background: ${theme.colors.bg.browser};
        color: ${theme.colors.text.main};
      `;
    }

    return css`
      background: ${theme.colors.brand.lightest};
      color: ${theme.colors.brand.dark};
    `;
  }}
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $variant: "approve" | "reject" }>`
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  padding: 8px 14px;
  cursor: pointer;

  ${({ $variant, theme }) => {
    if ($variant === "approve") {
      return css`
        border: 1px solid ${theme.colors.brand.light};
        background: ${theme.colors.brand.light};
        color: ${theme.colors.bg.white};
      `;
    }

    return css`
      border: 1px solid ${theme.colors.text.main};
      background: ${theme.colors.text.main};
      color: ${theme.colors.bg.white};
    `;
  }}
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.brand.light : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.brand.lightest : theme.colors.bg.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.brand.dark : theme.colors.text.muted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  min-width: 24px;
  text-align: center;
`;

const PageSize = styled.select`
  min-width: 90px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg.white};
  color: ${({ theme }) => theme.colors.text.muted};
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.main};
  word-break: break-word;
`;

const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.brand.dark};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const requestedAtText = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AllCreatorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );

  const totalItems = response.data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageData = response.data.slice(startIndex, endIndex);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safePage <= 3) {
      return [1, 2, 3];
    }

    if (safePage >= totalPages - 2) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [safePage - 1, safePage, safePage + 1];
  }, [safePage, totalPages]);

  return (
    <Wrapper>
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
          {pageData.map((creator) => {
            const showApprove = creator.status === "pending";
            const showReject =
              creator.status === "pending" || creator.status === "approved";

            return (
              <TableRow
                key={creator.id}
                onClick={() => setSelectedCreator(creator)}
              >
                <Td>
                  <CreatorCell>
                    <CreatorName>{creator.fullName}</CreatorName>
                    <MiniText>@{creator.city}</MiniText>
                  </CreatorCell>
                </Td>
                <Td>{creator.email}</Td>
                <Td>{requestedAtText(creator.createdAt)}</Td>
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
      <Footer>
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} requests
        </span>
        <PaginationControls>
          <PaginationButton
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
          >
            &lt;
          </PaginationButton>

          {pageNumbers[0] > 1 ? (
            <>
              <PaginationButton type="button" onClick={() => setCurrentPage(1)}>
                1
              </PaginationButton>
              <Ellipsis>...</Ellipsis>
            </>
          ) : null}

          {pageNumbers.map((pageNumber) => (
            <PaginationButton
              key={pageNumber}
              type="button"
              $active={safePage === pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </PaginationButton>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages ? (
            <>
              <Ellipsis>...</Ellipsis>
              <PaginationButton
                type="button"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </PaginationButton>
            </>
          ) : null}

          <PaginationButton
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safePage === totalPages}
          >
            &gt;
          </PaginationButton>

          <PageSize
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </PageSize>
        </PaginationControls>
      </Footer>

      <Modal
        title={
          selectedCreator
            ? `${selectedCreator.fullName} Details`
            : "Creator Details"
        }
        open={Boolean(selectedCreator)}
        onClose={() => setSelectedCreator(null)}
      >
        {selectedCreator ? (
          <DetailGrid>
            <DetailItem>
              <DetailLabel>ID</DetailLabel>
              <DetailValue>{selectedCreator.id}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Full Name</DetailLabel>
              <DetailValue>{selectedCreator.fullName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>First Name</DetailLabel>
              <DetailValue>{selectedCreator.firstName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Last Name</DetailLabel>
              <DetailValue>{selectedCreator.lastName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Email</DetailLabel>
              <DetailValue>{selectedCreator.email}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Phone</DetailLabel>
              <DetailValue>{selectedCreator.phone}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>CVR</DetailLabel>
              <DetailValue>{selectedCreator.cvr}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{selectedCreator.status}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Address</DetailLabel>
              <DetailValue>{selectedCreator.address}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>City</DetailLabel>
              <DetailValue>{selectedCreator.city}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Postal Code</DetailLabel>
              <DetailValue>{selectedCreator.postalCode}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Example Work Link</DetailLabel>
              <DetailValue>
                <LinkText
                  href={selectedCreator.exampleWorkLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedCreator.exampleWorkLink}
                </LinkText>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Approved User ID</DetailLabel>
              <DetailValue>
                {selectedCreator.approvedUserId ?? "null"}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Is Deleted</DetailLabel>
              <DetailValue>{String(selectedCreator.isDeleted)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Deleted At</DetailLabel>
              <DetailValue>{selectedCreator.deletedAt ?? "null"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Created At</DetailLabel>
              <DetailValue>{selectedCreator.createdAt}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Updated At</DetailLabel>
              <DetailValue>{selectedCreator.updatedAt}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Content Description</DetailLabel>
              <DetailValue>{selectedCreator.contentDescription}</DetailValue>
            </DetailItem>
          </DetailGrid>
        ) : null}
      </Modal>
    </Wrapper>
  );
}
