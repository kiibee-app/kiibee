"use client";

import { useState } from "react";
import creatorsResponse from "../../../data/all-creator-requests.json";
import type {
  CreatorRequest,
  CreatorResponse,
} from "../../../types/creator-request";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { AllCreatorsPanel } from "./AllCreators.styles";
import { CreatorRequestsTable } from "./CreatorRequestsTable";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorDetailsModal } from "./CreatorDetailsModal";

const response = creatorsResponse as CreatorResponse;

export function AllCreatorsTable() {
  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );

  const totalItems = response.data.length;
  const pagination = usePagination({
    data: response.data,
    totalItems,
    initialPageSize: 5,
  });

  return (
    <AllCreatorsPanel>
      <CreatorRequestsTable
        creators={pagination.paginatedData}
        onSelectCreator={(creator) => setSelectedCreator(creator)}
      />

      <CreatorPagination
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={totalItems}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        pageNumbers={pagination.pageNumbers}
        pageSize={pagination.pageSize}
        onPageChange={pagination.onPageChange}
        onPageSizeChange={pagination.onPageSizeChange}
      />

      <CreatorDetailsModal
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </AllCreatorsPanel>
  );
}
