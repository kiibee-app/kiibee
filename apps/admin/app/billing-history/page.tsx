"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/api/api-client";
import {
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

export default function BillingHistoryPage() {
  const [kind, setKind] = useState<"subscription" | "content">("subscription");
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["admin-billing-history", kind, page],
    queryFn: async () => {
      const response = await apiClient<BillingHistory>(
        `/payment/admin/billing-history?kind=${kind}&page=${page}`,
      );
      if (!response.success || !response.data)
        throw new Error(response.message || "Failed to load billing history");
      return response.data;
    },
  });
  return (
    <AllCreatorsLayout>
      <h1>Billing History</h1>
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
