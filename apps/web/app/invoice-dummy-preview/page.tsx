"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import InvoiceModal from "@/components/Feature/Dashboard/ClientViewerBillings/InvoiceModal";
import SettlementInvoiceModal from "@/components/Feature/Settings/Payout/SettlementInvoiceModal";
import { API } from "@/lib/http/api/endpoints";
function Preview() {
  const kind = useSearchParams().get("kind") || "purchase";
  const q = useQueryClient();
  useState(() => {
    const key = [API.order.billingInvoice("new-dummy")];
    q.setQueryDefaults(key, { staleTime: Infinity });
    q.setQueryData(key, {
      data: {
        orderNumber: kind === "rental" ? "DEMO-RENT-002" : "DEMO-BUY-001",
        type: kind === "rental" ? "rented" : "purchased",
        paymentDate: "2026-11-20T10:00:00Z",
        amount: kind === "rental" ? "49.00" : "15.00",
        currency: "DKK",
        paymentMethod: "visa",
        cardNumber: "0000000000001234",
        contentDetails: {
          contentTitle: "Demo content",
          creatorName: "Demo Creator",
        },
      },
    });
    return true;
  });
  return (
    <main style={{ minHeight: "100vh", background: "#f2f5f4", padding: 40 }}>
      <p>DUMMY DATA — Updated invoice UI</p>
      {kind === "settlement" ? (
        <SettlementInvoiceModal
          open
          row={{
            creditNo: "DEMO-CREDIT-003",
            status: "Paid",
            date: "20 Nov 2026",
            amount: "780.00 DKK",
            bank: "Demo Bank",
          }}
          onClose={() => {}}
        />
      ) : (
        <InvoiceModal visible billingId="new-dummy" onClose={() => {}} />
      )}
    </main>
  );
}
export default function Page() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
