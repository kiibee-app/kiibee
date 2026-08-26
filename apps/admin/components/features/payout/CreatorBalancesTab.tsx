"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreatorPagination } from "../all-creators/CreatorPagination";
import { useCreatorWallets } from "../../../hooks/api";
import { useDebounce } from "../../../hooks/ui/use-debounce";
import { usePagination } from "../../../hooks/ui/use-pagination";
import type { CreatorWalletItem } from "../../../types/payout-request";
import { formatAmount, MIN_PAYOUT_AMOUNT } from "../../../utils/payout";
import {
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  ClearIcon,
  CreatorCell,
  CreatorName,
  HeaderControls,
  MiniText,
  RequestTableRow,
  RequestsTable,
  SearchClearButton,
  SearchContainer,
  SearchIcon,
  SearchIconWrapper,
  SearchInput,
  StatusBadge,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "../all-creators/AllCreators.styles";
import {
  InlineActionButton,
  InlineActionGroup,
  InlineSecondaryButton,
  PayoutHint,
} from "./PayoutDashboard.styles";
import { AdminPayoutModal } from "./AdminPayoutModal";
import { AccountDetailsModal } from "./AccountDetailsModal";

export function CreatorBalancesTab() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreator, setSelectedCreator] =
    useState<CreatorWalletItem | null>(null);
  const [accountDetailsCreator, setAccountDetailsCreator] =
    useState<CreatorWalletItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchTerm);
  const walletsQuery = useCreatorWallets({
    page,
    limit: pageSize,
    search: debouncedSearch.trim() || undefined,
  });

  const response = walletsQuery.data;
  const items = response?.items ?? [];
  const totalItems = response?.pagination.totalItems ?? 0;
  const walletsPagination = usePagination({
    data: items,
    totalItems,
    mode: "server",
    currentPage: response?.pagination.page ?? page,
    pageSize: response?.pagination.limit ?? pageSize,
    onPageChange: setPage,
    onPageSizeChange: (nextPageSize) => {
      setPageSize(nextPageSize);
      setPage(1);
    },
    storageKey: "kiibee.admin.creatorWallets.pageSize",
  });

  const handleSearchClear = () => {
    setSearchTerm("");
    setPage(1);
    searchInputRef.current?.focus();
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader>
        <PayoutHint>
          View creator balances and process payouts from available funds.
        </PayoutHint>
        <HeaderControls>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              ref={searchInputRef}
              placeholder="Search creator by name or email..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
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

      <AllCreatorsPanel>
        {walletsQuery.isLoading ? (
          <AllCreatorsState>Loading creator balances...</AllCreatorsState>
        ) : walletsQuery.isError ? (
          <AllCreatorsState>
            {walletsQuery.error?.message || "Failed to load creator balances."}
          </AllCreatorsState>
        ) : items.length ? (
          <>
            <TableScrollWrapper>
              <RequestsTable>
                <thead>
                  <tr>
                    <TableHeaderCell>Creator</TableHeaderCell>
                    <TableHeaderCell>Balance</TableHeaderCell>
                    <TableHeaderCell>Payment method</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Action</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {items.map((creator) => {
                    const balance = Number(creator.walletBalance);
                    const canPayout =
                      balance > MIN_PAYOUT_AMOUNT &&
                      creator.hasPaymentMethod &&
                      !creator.hasPendingRequest;

                    return (
                      <RequestTableRow key={creator.creatorId}>
                        <TableBodyCell>
                          <CreatorCell>
                            <CreatorName>
                              {creator.fullName || "Unknown Creator"}
                            </CreatorName>
                            <MiniText>{creator.email}</MiniText>
                          </CreatorCell>
                        </TableBodyCell>
                        <TableBodyCell>
                          <CreatorName>
                            {formatAmount(
                              creator.walletBalance,
                              creator.walletCurrency,
                            )}
                          </CreatorName>
                        </TableBodyCell>
                        <TableBodyCell>
                          {creator.accountDetails ? (
                            <CreatorCell>
                              <CreatorName>
                                {creator.accountDetails.methodType === "card"
                                  ? `Card •••• ${(creator.accountDetails.cardNumber || "").slice(-4) || "----"}`
                                  : creator.accountDetails.bankName ||
                                    "Bank account"}
                              </CreatorName>
                              <MiniText>
                                {creator.accountDetails.methodType === "card"
                                  ? `Valid ${creator.accountDetails.cardExpiry || "—"}`
                                  : `•••• ${(creator.accountDetails.accountNumber || "").slice(-4) || "----"}`}
                              </MiniText>
                            </CreatorCell>
                          ) : creator.hasPaymentMethod ? (
                            <CreatorCell>
                              <CreatorName>
                                {creator.paymentMethods[0]?.label || "On file"}
                              </CreatorName>
                              <MiniText>
                                {creator.paymentMethods.length} method
                                {creator.paymentMethods.length === 1 ? "" : "s"}
                              </MiniText>
                            </CreatorCell>
                          ) : (
                            <MiniText>No payment method</MiniText>
                          )}
                        </TableBodyCell>
                        <TableBodyCell>
                          {creator.hasPendingRequest ? (
                            <StatusBadge $status="pending">Pending</StatusBadge>
                          ) : balance > MIN_PAYOUT_AMOUNT ? (
                            <StatusBadge $status="approved">
                              Available
                            </StatusBadge>
                          ) : balance > 0 ? (
                            <StatusBadge $status="pending">
                              Below minimum
                            </StatusBadge>
                          ) : (
                            <StatusBadge $status="rejected">
                              No balance
                            </StatusBadge>
                          )}
                        </TableBodyCell>
                        <TableBodyCell>
                          <InlineActionGroup>
                            {creator.hasPendingRequest &&
                            creator.pendingRequestId ? (
                              <InlineActionButton
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/payout-requests/${creator.pendingRequestId}`,
                                  )
                                }
                              >
                                View request
                              </InlineActionButton>
                            ) : (
                              <InlineActionButton
                                type="button"
                                disabled={!canPayout}
                                onClick={() => setSelectedCreator(creator)}
                                title={
                                  !creator.hasPaymentMethod
                                    ? "Creator needs a bank account"
                                    : balance <= MIN_PAYOUT_AMOUNT
                                      ? `Balance must be greater than ${MIN_PAYOUT_AMOUNT} DKK`
                                      : "Process payout"
                                }
                              >
                                Process payout
                              </InlineActionButton>
                            )}
                            <InlineSecondaryButton
                              type="button"
                              onClick={() => setAccountDetailsCreator(creator)}
                            >
                              {creator.accountDetails
                                ? "Edit details"
                                : "Add details"}
                            </InlineSecondaryButton>
                          </InlineActionGroup>
                        </TableBodyCell>
                      </RequestTableRow>
                    );
                  })}
                </tbody>
              </RequestsTable>
            </TableScrollWrapper>
            <CreatorPagination
              startIndex={walletsPagination.startIndex}
              endIndex={walletsPagination.endIndex}
              totalItems={totalItems}
              currentPage={walletsPagination.currentPage}
              totalPages={walletsPagination.totalPages}
              pageNumbers={walletsPagination.pageNumbers}
              pageSize={walletsPagination.pageSize}
              itemLabel="creators"
              onPageChange={walletsPagination.onPageChange}
              onPageSizeChange={walletsPagination.onPageSizeChange}
            />
          </>
        ) : (
          <AllCreatorsState>No creators found.</AllCreatorsState>
        )}
      </AllCreatorsPanel>

      <AdminPayoutModal
        creator={selectedCreator}
        open={Boolean(selectedCreator)}
        onClose={() => setSelectedCreator(null)}
      />
      <AccountDetailsModal
        creator={accountDetailsCreator}
        open={Boolean(accountDetailsCreator)}
        onClose={() => setAccountDetailsCreator(null)}
      />
    </AllCreatorsLayout>
  );
}
