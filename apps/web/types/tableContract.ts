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
  getRowKey?: (row: T, index: number) => string | number;
  emptyText?: string;
  hasData?: boolean | undefined;
  rowsPerPage?: number;
  pagination?: {
    safeCurrentPage: number | undefined;
    effectiveRowsPerPage: number | undefined;
  };
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
