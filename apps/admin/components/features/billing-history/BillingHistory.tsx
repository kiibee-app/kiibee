"use client";

import { ArrowLeft } from "lucide-react";
import { BackLink } from "@/components/features/viewers/Viewers.styles";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/api/api-client";
import {
  SearchContainer,
  SearchIconWrapper,
  SearchIcon,
  SearchInput,
  SearchClearButton,
  ClearIcon,
  AllCreatorsLayout,
  AllCreatorsHeader,
  AllCreatorsTabs,
  AllCreatorsTabButton,
  AllCreatorsPanel,
  AllCreatorsState,
  TableScrollWrapper,
  RequestsTable,
  TableHeaderCell,
  TableBodyCell,
} from "@/components/features/all-creators/AllCreators.styles";

import { useDebounce } from "@/hooks/ui/use-debounce";

type BillingRow = {
  id: string;
  email: string | null;
  companyName: string | null;
  reference: string | null;
  description: string | null;
  itemType?: string;
  amount: string;
  currency: string;
  status: string;
  method: string | null;
  createdAt: string | null;
};
type BillingHistory = { items: BillingRow[]; page: number; hasMore: boolean };

export function BillingHistory({ creatorId }: { creatorId?: string }) {
  const [kind, setKind] = useState<"subscription" | "content">("subscription");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search.trim());
  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const query = useQuery({
    queryKey: ["admin-billing-history", creatorId, kind, page, debouncedSearch],
    queryFn: async () => {
      const response = await apiClient<BillingHistory>(
        `/payment/admin/billing-history?kind=${kind}&page=${page}&search=${encodeURIComponent(debouncedSearch)}${creatorId ? `&creatorId=${encodeURIComponent(creatorId)}` : ""}`,
      );
      if (!response.success || !response.data)
        throw new Error(response.message || "Failed to load billing history");
      return response.data;
    },
  });
  return (
    <AllCreatorsLayout>
      {creatorId && (
        <BackLink href={`/all-creators/${creatorId}`}>
          <ArrowLeft size={16} />
          Back to Creator Details
        </BackLink>
      )}
      <h1>{creatorId ? "Subscription Billing History" : "Billing History"}</h1>
      {!creatorId && (
        <AllCreatorsHeader>
          <AllCreatorsTabs>
            {(["subscription", "content"] as const).map((tab) => (
              <AllCreatorsTabButton
                key={tab}
                type="button"
                $active={kind === tab}
                onClick={() => {
                  setKind(tab);
                  setPage(1);
                }}
              >
                {tab === "subscription"
                  ? "Subscription Payment History"
                  : "Content Buy / Rent — ePay"}
              </AllCreatorsTabButton>
            ))}
          </AllCreatorsTabs>
        </AllCreatorsHeader>
      )}
      <SearchContainer>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <SearchInput
          ref={searchInputRef}
          type="search"
          aria-label="Search billing history"
          placeholder="Search name, email, company, transaction or content..."
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
        />
        {search && (
          <SearchClearButton
            type="button"
            aria-label="Clear billing search"
            onClick={() => {
              updateSearch("");
              searchInputRef.current?.focus();
            }}
          >
            <ClearIcon />
          </SearchClearButton>
        )}
      </SearchContainer>
      <AllCreatorsPanel>
        {query.isPending ? (
          <AllCreatorsState>Loading billing history…</AllCreatorsState>
        ) : query.isError ? (
          <AllCreatorsState>
            {query.error.message}
            <button onClick={() => void query.refetch()}>Retry</button>
          </AllCreatorsState>
        ) : !query.data.items.length ? (
          <AllCreatorsState>No billing history found.</AllCreatorsState>
        ) : (
          <TableScrollWrapper>
            <RequestsTable>
              <thead>
                <tr>
                  {[
                    "Date",
                    "Customer",
                    "Company Name",
                    kind === "subscription"
                      ? "Subscription Plan"
                      : "Content Name",
                    "Type",
                    "Transaction",
                    "Amount",
                    "Method",
                    "Status",
                  ].map((label) => (
                    <TableHeaderCell key={label}>{label}</TableHeaderCell>
                  ))}
                </tr>
              </thead>
              <tbody>
                {query.data.items.map((row) => (
                  <tr key={row.id}>
                    <TableBodyCell>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString()
                        : "—"}
                    </TableBodyCell>
                    <TableBodyCell>{row.email || "—"}</TableBodyCell>
                    <TableBodyCell>{row.companyName || "—"}</TableBodyCell>
                    <TableBodyCell>{row.description || "—"}</TableBodyCell>
                    <TableBodyCell>
                      {row.itemType || "Subscription"}
                    </TableBodyCell>
                    <TableBodyCell>{row.reference || row.id}</TableBodyCell>
                    <TableBodyCell>
                      {row.amount} {row.currency}
                    </TableBodyCell>
                    <TableBodyCell>{row.method || "—"}</TableBodyCell>
                    <TableBodyCell>{row.status}</TableBodyCell>
                  </tr>
                ))}
              </tbody>
            </RequestsTable>
          </TableScrollWrapper>
        )}
      </AllCreatorsPanel>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button
          disabled={page === 1 || query.isFetching}
          onClick={() => setPage((value) => value - 1)}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={!query.data?.hasMore || query.isFetching}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </AllCreatorsLayout>
  );
}
