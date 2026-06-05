"use client";

import React, { useState } from "react";
import { TableContainer } from "./styles";
import DesktopTable from "./DesktopTable";
import MobileTable from "./MobileTable";
import Pagination from "./TablePagination";
import { useTablePagination } from "./useTablePagination";
import { TableProps } from "@/types/tableContract";

export default function Table<T extends Record<string, unknown>>({
  headers,
  data,
  headerToKey,
  getColumnAlignment,
  renderCell,
  renderHeaderFilter,
  getRowKey,
  getMobileTitle,
  emptyText,
  rowsPerPage = 3,
  onRowClick,
  onHeaderClick,
  isHeaderSortable,
  getHeaderSortDirection,
}: TableProps<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(rowsPerPage);

  const {
    paginatedData,
    totalPages,
    safeCurrentPage,
    pageNumbers,
    effectiveRowsPerPage,
  } = useTablePagination({
    data,
    rowsPerPage: currentRowsPerPage,
    currentPage,
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handlePageChange = (page: number) => {
    const safe = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safe);
    setOpenIndex(null);
  };

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setCurrentRowsPerPage(nextRowsPerPage);
    setCurrentPage(1);
    setOpenIndex(null);
  };

  const hasData = data.length > 0;

  const paginationMeta = {
    safeCurrentPage,
    effectiveRowsPerPage,
  };

  return (
    <>
      <TableContainer>
        <DesktopTable
          headers={headers}
          data={paginatedData}
          headerToKey={headerToKey}
          getColumnAlignment={getColumnAlignment}
          renderCell={renderCell}
          renderHeaderFilter={renderHeaderFilter}
          getRowKey={getRowKey}
          emptyText={emptyText}
          hasData={hasData}
          pagination={paginationMeta}
          onRowClick={onRowClick}
          onHeaderClick={onHeaderClick}
          isHeaderSortable={isHeaderSortable}
          getHeaderSortDirection={getHeaderSortDirection}
        />

        <MobileTable
          headers={headers}
          data={paginatedData}
          headerToKey={headerToKey}
          renderCell={renderCell}
          getRowKey={getRowKey}
          getMobileTitle={getMobileTitle}
          openIndex={openIndex}
          toggleAccordion={toggleAccordion}
          hasData={hasData}
          pagination={paginationMeta}
          onRowClick={onRowClick}
          onHeaderClick={onHeaderClick}
          isHeaderSortable={isHeaderSortable}
          getHeaderSortDirection={getHeaderSortDirection}
        />
      </TableContainer>
      <Pagination
        totalPages={totalPages}
        currentPage={safeCurrentPage}
        pageNumbers={pageNumbers}
        rowsPerPage={effectiveRowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        onChange={handlePageChange}
      />
    </>
  );
}
