"use client";

import { useMemo, useState } from "react";
import type {
  CreatorDeletionRequest,
  CreatorDeletionRequestStatus,
} from "../../../types/creator-deletion-request";
import { useCreatorDeletionRequests } from "../../../hooks/api";
import { DeletionRequestsTable } from "./DeletionRequestsTable";
import { CreatorRequestsTableSkeleton } from "../all-creators/CreatorRequestsTableSkeleton";
import { useDeletionRequestActions } from "./useDeletionRequestActions";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
} from "../all-creators/AllCreators.styles";
import { DeletionRequestDetailsDrawer } from "./DeletionRequestDetailsDrawer";

export function DeletionRequestsList() {
  const [requestOverrides, setRequestOverrides] = useState<
    CreatorDeletionRequest[]
  >([]);
  const [selectedRequest, setSelectedRequest] =
    useState<CreatorDeletionRequest | null>(null);
  const deletionRequestsQuery = useCreatorDeletionRequests();

  const requests = useMemo(() => {
    const requestMap = new Map<string, CreatorDeletionRequest>();

    for (const request of deletionRequestsQuery.data ?? []) {
      requestMap.set(request.id, request);
    }

    for (const request of requestOverrides) {
      requestMap.set(request.id, request);
    }

    return Array.from(requestMap.values()).sort(
      (firstRequest, secondRequest) =>
        new Date(secondRequest.createdAt).getTime() -
        new Date(firstRequest.createdAt).getTime(),
    );
  }, [requestOverrides, deletionRequestsQuery.data]);

  const updateRequestStatus = (
    request: CreatorDeletionRequest,
    status: CreatorDeletionRequestStatus,
  ) => {
    const updatedRequest: CreatorDeletionRequest = {
      ...request,
      status,
      updatedAt: new Date().toISOString(),
    };

    setRequestOverrides((currentOverrides) => {
      const nextOverrides = currentOverrides.filter(
        (currentRequest) => currentRequest.id !== request.id,
      );

      return [...nextOverrides, updatedRequest];
    });

    return updatedRequest;
  };

  const handleRequestUpdated = (request: CreatorDeletionRequest) => {
    const updated = updateRequestStatus(request, request.status);
    setSelectedRequest((prev) => (prev?.id === request.id ? updated : prev));
    return updated;
  };

  const {
    activeAction,
    activeRequestId,
    handleApproveRequest,
    handleRejectRequest,
  } = useDeletionRequestActions({
    onRequestUpdated: handleRequestUpdated,
  });

  const totalRequests = requests.length;

  const renderContent = () => {
    if (deletionRequestsQuery.isLoading) {
      return <CreatorRequestsTableSkeleton />;
    }

    if (deletionRequestsQuery.isError) {
      return (
        <AllCreatorsState>
          {deletionRequestsQuery.error?.message ||
            "Failed to load deletion requests."}
        </AllCreatorsState>
      );
    }

    if (!totalRequests) {
      return <AllCreatorsState>No deletion requests found.</AllCreatorsState>;
    }

    return (
      <DeletionRequestsTable
        requests={requests}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        activeAction={activeAction}
        activeRequestId={activeRequestId}
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
        actions={{
          activeAction,
          activeRequestId,
          onApproveRequest: handleApproveRequest,
          onRejectRequest: handleRejectRequest,
        }}
      />
    </AllCreatorsLayout>
  );
}
