"use client";

import { useCreatorDeletionHistory } from "../../../hooks/api";
import { CreatorRequestsTableSkeleton } from "../all-creators/CreatorRequestsTableSkeleton";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
} from "../all-creators/AllCreators.styles";
import { DeletionHistoryTable } from "./DeletionHistoryTable";

export function DeletionHistoryList() {
  const deletionHistoryQuery = useCreatorDeletionHistory();
  const requests = deletionHistoryQuery.data ?? [];

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

    return <DeletionHistoryTable requests={requests} />;
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsPanel>{renderContent()}</AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}
