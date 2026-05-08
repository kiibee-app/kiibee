import { SortDirection, TableAlign } from "@/utils/ui";

export type KeyOf<T> = keyof T & string;

export type RenderCellProps<T> = {
  header: string;
  value: unknown;
  row: T;
  rowIndex: number;
};

export type BaseTableProps<T> = {
  headers: string[];
  data: T[];
  headerToKey?: (h: string) => KeyOf<T>;
  renderCell?: (params: RenderCellProps<T>) => React.ReactNode;
  renderHeaderFilter?: (params: {
    header: string;
    index: number;
  }) => React.ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
  getColumnAlignment?: (header: string, index: number) => TableAlign;
  onRowClick?: (row: T, rowIndex: number) => void;
  emptyText?: string;
  hasData?: boolean | undefined;
  rowsPerPage?: number;
  pagination?: {
    safeCurrentPage?: number;
    effectiveRowsPerPage?: number;
  };
  onHeaderClick?: (header: string, index: number) => void;
  isHeaderSortable?: (header: string, index: number) => boolean;
  getHeaderSortDirection?: (header: string) => SortDirection | null;
};

export type MobileTableProps<T> = BaseTableProps<T> & {
  getMobileTitle?: (row: T) => string;
  openIndex: number | null;
  toggleAccordion: (i: number) => void;
};

export type TableProps<T> = BaseTableProps<T> & {
  getMobileTitle?: (row: T) => string;
};

export type SettlementRow = {
  amount: string;
  status: string;
  creditNo: string;
  bank: string;
  date: string;
};
