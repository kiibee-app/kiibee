"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePayoutRequests } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { useDebounce } from "@/hooks/ui/use-debounce";
import { CreatorPagination } from "../all-creators/CreatorPagination";
import {
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  ClearIcon,
  HeaderControls,
  SearchClearButton,
  SearchContainer,
  SearchIcon,
  SearchIconWrapper,
  SearchInput,
  TableScrollWrapper,
  RequestsTable,
  TableHeaderCell,
  RequestTableRow,
  TableBodyCell,
  CreatorCell,
  CreatorName,
  MiniText,
  StatusBadge,
} from "../all-creators/AllCreators.styles";
import type { PayoutRequest } from "../../../types/payout-request";
import type { CreatorStatus } from "../../../types/creator-request";

const toCreatorStatus = (status: string): CreatorStatus => {
  if (status === "approved" || status === "rejected") {
    return status;
  }

  return "pending";
};

export function PayoutRequestsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: requests, isLoading, isError, error } = usePayoutRequests();
  const router = useRouter();

  const handleSearchClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const debouncedSearchLower = debouncedSearch.toLowerCase().trim();
  const filteredRequests = (requests || []).filter((req) => {
    if (!debouncedSearchLower) return true;
    return (
      req.fullName?.toLowerCase().includes(debouncedSearchLower) ||
      req.email?.toLowerCase().includes(debouncedSearchLower) ||
      req.payoutId?.toLowerCase().includes(debouncedSearchLower)
    );
  });

  const totalRequests = filteredRequests.length;
  const requestsPagination = usePagination({
    data: filteredRequests,
    totalItems: totalRequests,
    initialPageSize: 10,
    storageKey: "kiibee.admin.payoutRequests.pageSize",
  });

  const renderContent = () => {
    if (isLoading) {
      return <AllCreatorsState>Loading payout requests...</AllCreatorsState>;
    }

    if (isError) {
      return (
        <AllCreatorsState>
          {error?.message || "Failed to load payout requests."}
        </AllCreatorsState>
      );
    }

    if (!totalRequests) {
      return <AllCreatorsState>No payout requests found.</AllCreatorsState>;
    }

    return (
      <>
        <TableScrollWrapper>
          <RequestsTable>
            <thead>
              <tr>
                <TableHeaderCell>Creator</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Fees</TableHeaderCell>
                <TableHeaderCell>Net Payout</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {requestsPagination.paginatedData.map((req: PayoutRequest) => (
                <RequestTableRow
                  key={req.id}
                  onClick={() => router.push(`/payout-requests/${req.id}`)}
                >
                  <TableBodyCell>
                    <CreatorCell>
                      <CreatorName>{req.fullName || "Unknown"}</CreatorName>
                      <MiniText>{req.email || "No email"}</MiniText>
                    </CreatorCell>
                  </TableBodyCell>
                  <TableBodyCell>
                    <CreatorCell>
                      <CreatorName>
                        {req.rawAmount} {req.currency}
                      </CreatorName>
                    </CreatorCell>
                  </TableBodyCell>
                  <TableBodyCell>
                    <CreatorCell>
                      <MiniText>
                        Plat: {req.platformFee} {req.currency}
                      </MiniText>
                      <MiniText>
                        Proc: {req.processingFee} {req.currency}
                      </MiniText>
                    </CreatorCell>
                  </TableBodyCell>
                  <TableBodyCell>
                    <CreatorName>
                      {req.payableAmount} {req.currency}
                    </CreatorName>
                  </TableBodyCell>
                  <TableBodyCell>
                    <StatusBadge $status={toCreatorStatus(req.status)}>
                      {req.status}
                    </StatusBadge>
                  </TableBodyCell>
                  <TableBodyCell>
                    <MiniText>
                      {req.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(req.createdAt))
                        : "N/A"}
                    </MiniText>
                  </TableBodyCell>
                </RequestTableRow>
              ))}
            </tbody>
          </RequestsTable>
        </TableScrollWrapper>
        <CreatorPagination
          startIndex={requestsPagination.startIndex}
          endIndex={requestsPagination.endIndex}
          totalItems={totalRequests}
          currentPage={requestsPagination.currentPage}
          totalPages={requestsPagination.totalPages}
          pageNumbers={requestsPagination.pageNumbers}
          pageSize={requestsPagination.pageSize}
          itemLabel="requests"
          onPageChange={requestsPagination.onPageChange}
          onPageSizeChange={requestsPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader style={{ justifyContent: "flex-end" }}>
        <HeaderControls>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              ref={searchInputRef}
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm ? (
              <SearchClearButton
                type="button"
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                <ClearIcon />
              </SearchClearButton>
            ) : null}
          </SearchContainer>
        </HeaderControls>
      </AllCreatorsHeader>

      <AllCreatorsPanel>{renderContent()}</AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}
