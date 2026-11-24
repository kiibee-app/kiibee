"use client";

import { useRef, useState } from "react";
import { useCreatorDeletionHistory } from "../../../hooks/api";
import { formatRequestedAt } from "../../../utils/date";
import {
  AllCreatorsPanel,
  AllCreatorsLayout,
  AllCreatorsControlsHeader,
  HeaderControls,
  SearchContainer,
  SearchIconWrapper,
  SearchIcon,
  SearchInput,
  SearchClearButton,
  ClearIcon,
  AllCreatorsState,
  RequestsTable,
  TableBodyCell,
  TableHeaderCell,
  TableScrollWrapper,
} from "./AllCreators.styles";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";

export function ClosedCreatorHistory() {
  const query = useCreatorDeletionHistory();
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closed = (query.data ?? []).filter(
    (item) => item.status === "approved" && item.user.deletedAt,
  );
  const term = search.trim().toLowerCase();
  const rows = closed.filter((item) =>
    `${item.user.fullName} ${item.user.email}`.toLowerCase().includes(term),
  );

  if (query.isLoading) return <CreatorRequestsTableSkeleton />;
  if (query.isError)
    return (
      <AllCreatorsState>
        {query.error.message || "Failed to load closed accounts."}
      </AllCreatorsState>
    );

  return (
    <AllCreatorsLayout>
      <AllCreatorsControlsHeader>
        <HeaderControls>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              ref={searchInputRef}
              aria-label="Search closed accounts"
              placeholder="Search closed accounts"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <SearchClearButton
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  searchInputRef.current?.focus();
                }}
              >
                <ClearIcon />
              </SearchClearButton>
            )}
          </SearchContainer>
        </HeaderControls>
      </AllCreatorsControlsHeader>
      <AllCreatorsPanel>
        {!rows.length ? (
          <AllCreatorsState>
            {term ? "No matching closed accounts." : "No closed accounts yet."}
          </AllCreatorsState>
        ) : (
          <TableScrollWrapper>
            <RequestsTable>
              <thead>
                <tr>
                  {["Creator", "Email", "Closed at", "Reason", "Status"].map(
                    (label) => (
                      <TableHeaderCell key={label}>{label}</TableHeaderCell>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <TableBodyCell>
                      {item.user.fullName || item.user.email}
                    </TableBodyCell>
                    <TableBodyCell>{item.user.email}</TableBodyCell>
                    <TableBodyCell>
                      {formatRequestedAt(item.user.deletedAt || item.updatedAt)}
                    </TableBodyCell>
                    <TableBodyCell>{item.reason || "—"}</TableBodyCell>
                    <TableBodyCell>Closed</TableBodyCell>
                  </tr>
                ))}
              </tbody>
            </RequestsTable>
          </TableScrollWrapper>
        )}
      </AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}
