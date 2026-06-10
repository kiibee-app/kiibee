export interface CreatorPaginationProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  pageSize: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
