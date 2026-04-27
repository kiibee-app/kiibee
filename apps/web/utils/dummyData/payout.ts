import { SettlementRow } from "@/types/tableContract";

export const settlementHeaders: string[] = [
  "Amount",
  "Status",
  "Credit No",
  "Bank",
  "Date",
];

export const settlementData: SettlementRow[] = [
  {
    amount: "32kr.",
    status: "Pending",
    creditNo: "KBF-1645",
    bank: "-",
    date: "17 Oct 2025",
  },
  {
    amount: "32kr.",
    status: "Completed",
    creditNo: "KBF-1645",
    bank: "-",
    date: "17 Oct 2025",
  },
  {
    amount: "32kr.",
    status: "Completed",
    creditNo: "KBF-1645",
    bank: "-",
    date: "17 Oct 2025",
  },
  {
    amount: "32kr.",
    status: "Rejected",
    creditNo: "KBF-1645",
    bank: "-",
    date: "17 Oct 2025",
  },
  {
    amount: "128kr.",
    status: "Pending",
    creditNo: "KBF-1890",
    bank: "-",
    date: "18 Oct 2025",
  },
];
