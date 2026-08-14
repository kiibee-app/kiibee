"use client";

import { useState } from "react";
import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import { useCreatorDeletionHistory } from "../../../hooks/api";
import { CreatorRequestsTableSkeleton } from "../all-creators/CreatorRequestsTableSkeleton";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
} from "../all-creators/AllCreators.styles";
import { DeletionHistoryTable } from "./DeletionHistoryTable";
import { DeletionRequestDetailsDrawer } from "./DeletionRequestDetailsDrawer";

export function DeletionHistoryList() {
  const deletionHistoryQuery = useCreatorDeletionHistory();
  const requests = deletionHistoryQuery.data ?? [];
  const [selectedRequest, setSelectedRequest] =
    useState<CreatorDeletionRequest | null>(null);

  const renderContent = () => {
    if (deletionHistoryQuery.isLoading) {
      return <CreatorRequestsTableSkeleton />;
    }

    if (deletionHistoryQuery.isError) {
      return (
        <AllCreatorsState>
          {deletionHistoryQuery.error?.message ||
            "Failed to load deletion history."}
        </AllCreatorsState>
      );
    }

    if (!requests.length) {
      return <AllCreatorsState>No deletion history found.</AllCreatorsState>;
    }

    return (
      <DeletionHistoryTable
        requests={requests}
        onSelectRequest={setSelectedRequest}
      />
    );
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsPanel>{renderContent()}</AllCreatorsPanel>
      <DeletionRequestDetailsDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </AllCreatorsLayout>
  );
}
