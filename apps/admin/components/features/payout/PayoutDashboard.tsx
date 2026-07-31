"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PayoutRequestsList } from "../payout-requests/PayoutRequestsList";
import { CreatorPagination } from "../all-creators/CreatorPagination";
import { CreatorBalancesTab } from "./CreatorBalancesTab";
import {
  useAllPayoutHistory,
  useExistingCreators,
  usePayoutHistoryByCreator,
} from "../../../hooks/api";
import { useDebounce } from "../../../hooks/ui/use-debounce";
import { usePagination } from "../../../hooks/ui/use-pagination";
import type { ExistingCreator } from "../../../types/existing-creator";
import type {
  PayoutHistoryItem,
  PayoutTab,
} from "../../../types/payout-request";
import { toCreatorStatus } from "../../../utils/status";
import {
  formatAmount,
  formatDate,
  isPayoutTab,
  PAYOUT_TAB_QUERY,
  payoutTabHref,
  payoutTabs,
  toPayoutBadgeStatus,
} from "../../../utils/payout";
import { getExistingCreatorDisplayName } from "../../../utils/existingCreatorsConfig";
import {
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  AllCreatorsTabButton,
  AllCreatorsTabs,
  ClearIcon,
  CreatorCell,
  CreatorName,
  HeaderControls,
  MiniText,
  PlanFilterSelect,
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
  PayoutHint,
  PayoutStatusBadge,
  PayoutToolbar,
} from "./PayoutDashboard.styles";

function HistoryTable({
  items,
  showCreator,
}: {
  items: PayoutHistoryItem[];
  showCreator?: boolean;
}) {
  const router = useRouter();

  return (
    <TableScrollWrapper>
      <RequestsTable>
        <thead>
          <tr>
            {showCreator ? <TableHeaderCell>Creator</TableHeaderCell> : null}
            <TableHeaderCell>Payout</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Fees</TableHeaderCell>
            <TableHeaderCell>Net Payout</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const canOpenRequest = Boolean(item.payoutRequestId);

            return (
              <RequestTableRow
                key={`${item.id}-${item.payoutRequestId ?? "history"}`}
                onClick={() => {
                  if (canOpenRequest) {
                    router.push(`/payout-requests/${item.payoutRequestId}`);
                  }
                }}
                style={{ cursor: canOpenRequest ? "pointer" : "default" }}
              >
                {showCreator ? (
                  <TableBodyCell>
                    <CreatorCell>
                      <CreatorName>
                        {item.creatorFullName || "Unknown Creator"}
                      </CreatorName>
                      <MiniText>{item.creatorEmail || item.creatorId}</MiniText>
                    </CreatorCell>
                  </TableBodyCell>
                ) : null}
                <TableBodyCell>
                  <CreatorCell>
                    <CreatorName>{item.id}</CreatorName>
                    <MiniText>
                      Request: {item.payoutRequestId || "N/A"}
                    </MiniText>
                  </CreatorCell>
                </TableBodyCell>
                <TableBodyCell>
                  {formatAmount(item.rawAmount ?? item.amount, item.currency)}
                </TableBodyCell>
                <TableBodyCell>
                  <CreatorCell>
                    <MiniText>
                      Plat: {formatAmount(item.platformFee, item.currency)}
                    </MiniText>
                    <MiniText>
                      Proc: {formatAmount(item.processingFee, item.currency)}
                    </MiniText>
                  </CreatorCell>
                </TableBodyCell>
                <TableBodyCell>
                  <CreatorName>
                    {formatAmount(
                      item.payableAmount ?? item.amount,
                      item.currency,
                    )}
                  </CreatorName>
                </TableBodyCell>
                <TableBodyCell>
                  <PayoutStatusBadge $status={toPayoutBadgeStatus(item.status)}>
                    {item.status}
                  </PayoutStatusBadge>
                </TableBodyCell>
                <TableBodyCell>
                  <MiniText>
                    {formatDate(item.payoutDate ?? item.createdAt)}
                  </MiniText>
                </TableBodyCell>
              </RequestTableRow>
            );
          })}
        </tbody>
      </RequestsTable>
    </TableScrollWrapper>
  );
}

function CreatorHistoryTab() {
  const [creatorSearch, setCreatorSearch] = useState("");
  const [selectedCreator, setSelectedCreator] =
    useState<ExistingCreator | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedCreatorSearch = useDebounce(creatorSearch);
  const creatorSearchTerm = debouncedCreatorSearch.trim();
  const creatorsQuery = useExistingCreators({
    search: creatorSearchTerm || undefined,
    page: 1,
    limit: 8,
  });
  const historyQuery = usePayoutHistoryByCreator(selectedCreator?.id ?? "");

  const items = historyQuery.data ?? [];
  const creators = creatorsQuery.data?.items ?? [];

  const handleClearSearch = () => {
    setCreatorSearch("");
    setSelectedCreator(null);
    searchInputRef.current?.focus();
  };

  return (
    <AllCreatorsLayout>
      <PayoutToolbar>
        <HeaderControls>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              ref={searchInputRef}
              placeholder="Search creator by name or email..."
              value={creatorSearch}
              onChange={(event) => {
                setCreatorSearch(event.target.value);
                setSelectedCreator(null);
              }}
            />
            {creatorSearch ? (
              <SearchClearButton
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear creator search"
              >
                <ClearIcon />
              </SearchClearButton>
            ) : null}
          </SearchContainer>
        </HeaderControls>
        <PayoutHint>
          {selectedCreator
            ? `Showing history for ${getExistingCreatorDisplayName(selectedCreator)}`
            : "Search and select a creator to load payout history."}
        </PayoutHint>
      </PayoutToolbar>

      <AllCreatorsPanel>
        {!selectedCreator ? (
          !creatorSearchTerm ? (
            <AllCreatorsState>
              Type a creator name or email to search payout history.
            </AllCreatorsState>
          ) : creatorsQuery.isLoading ? (
            <AllCreatorsState>Loading creators...</AllCreatorsState>
          ) : creatorsQuery.isError ? (
            <AllCreatorsState>
              {creatorsQuery.error?.message || "Failed to load creators."}
            </AllCreatorsState>
          ) : creators.length ? (
            <TableScrollWrapper>
              <RequestsTable>
                <thead>
                  <tr>
                    <TableHeaderCell>Creator</TableHeaderCell>
                    <TableHeaderCell>Channel</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((creator) => {
                    const displayName = getExistingCreatorDisplayName(creator);

                    return (
                      <RequestTableRow
                        key={creator.id}
                        onClick={() => setSelectedCreator(creator)}
                      >
                        <TableBodyCell>
                          <CreatorCell>
                            <CreatorName>{displayName}</CreatorName>
                            <MiniText>{creator.email}</MiniText>
                          </CreatorCell>
                        </TableBodyCell>
                        <TableBodyCell>
                          <CreatorCell>
                            <CreatorName>
                              {creator.channelName || "No channel"}
                            </CreatorName>
                            <MiniText>{creator.id}</MiniText>
                          </CreatorCell>
                        </TableBodyCell>
                        <TableBodyCell>
                          <StatusBadge
                            $status={toCreatorStatus(creator.status)}
                          >
                            {creator.status}
                          </StatusBadge>
                        </TableBodyCell>
                      </RequestTableRow>
                    );
                  })}
                </tbody>
              </RequestsTable>
            </TableScrollWrapper>
          ) : (
            <AllCreatorsState>No creators found.</AllCreatorsState>
          )
        ) : historyQuery.isLoading ? (
          <AllCreatorsState>Loading creator payout history...</AllCreatorsState>
        ) : historyQuery.isError ? (
          <AllCreatorsState>
            {historyQuery.error?.message || "Failed to load payout history."}
          </AllCreatorsState>
        ) : items.length ? (
          <HistoryTable items={items} />
        ) : (
          <AllCreatorsState>
            No payout history found for{" "}
            {getExistingCreatorDisplayName(selectedCreator)}.
          </AllCreatorsState>
        )}
      </AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}

function AllHistoryTab() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchTerm);
  const isStatusFiltered = Boolean(status);
  const historyQuery = useAllPayoutHistory({
    page: isStatusFiltered ? 1 : page,
    limit: isStatusFiltered ? 100 : pageSize,
    search: debouncedSearch.trim() || undefined,
  });

  const response = historyQuery.data;
  const allItems = response?.items ?? [];
  const items = status
    ? allItems.filter(
        (item) => item.status.toLowerCase() === status.toLowerCase(),
      )
    : allItems;
  const totalItems = isStatusFiltered
    ? items.length
    : (response?.pagination.totalItems ?? 0);
  const historyPagination = usePagination({
    data: items,
    totalItems,
    mode: isStatusFiltered ? "client" : "server",
    currentPage: isStatusFiltered ? page : (response?.pagination.page ?? page),
    pageSize: isStatusFiltered
      ? pageSize
      : (response?.pagination.limit ?? pageSize),
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
    storageKey: "kiibee.admin.allPayoutHistory.pageSize",
  });

  const handleSearchClear = () => {
    setSearchTerm("");
    setPage(1);
    searchInputRef.current?.focus();
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader>
        <PayoutHint>All creator payout history from the server.</PayoutHint>
        <HeaderControls>
          <PlanFilterSelect
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </PlanFilterSelect>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              ref={searchInputRef}
              placeholder="Search email, card, credit or amount..."
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
        {historyQuery.isLoading ? (
          <AllCreatorsState>Loading all payout history...</AllCreatorsState>
        ) : historyQuery.isError ? (
          <AllCreatorsState>
            {historyQuery.error?.message ||
              "Failed to load all payout history."}
          </AllCreatorsState>
        ) : items.length ? (
          <>
            <HistoryTable items={items} showCreator />
            <CreatorPagination
              startIndex={historyPagination.startIndex}
              endIndex={historyPagination.endIndex}
              totalItems={totalItems}
              currentPage={historyPagination.currentPage}
              totalPages={historyPagination.totalPages}
              pageNumbers={historyPagination.pageNumbers}
              pageSize={historyPagination.pageSize}
              itemLabel="payouts"
              onPageChange={historyPagination.onPageChange}
              onPageSizeChange={historyPagination.onPageSizeChange}
            />
          </>
        ) : (
          <AllCreatorsState>No payout history found.</AllCreatorsState>
        )}
      </AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}

export function PayoutDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = useMemo<PayoutTab>(() => {
    const tab = searchParams.get(PAYOUT_TAB_QUERY);
    return isPayoutTab(tab) ? tab : "balances";
  }, [searchParams]);

  const setActiveTab = (tab: PayoutTab) => {
    router.replace(payoutTabHref(tab), { scroll: false });
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader>
        <AllCreatorsTabs>
          {payoutTabs.map((tab) => (
            <AllCreatorsTabButton
              key={tab.key}
              type="button"
              $active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </AllCreatorsTabButton>
          ))}
        </AllCreatorsTabs>
      </AllCreatorsHeader>

      {activeTab === "balances" ? <CreatorBalancesTab /> : null}
      {activeTab === "requests" ? <PayoutRequestsList /> : null}
      {activeTab === "creator-history" ? <CreatorHistoryTab /> : null}
      {activeTab === "all-history" ? <AllHistoryTab /> : null}
    </AllCreatorsLayout>
  );
}
