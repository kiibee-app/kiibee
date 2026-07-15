"use client";

import React from "react";
import ClientViewerBillings from "@/components/Feature/Dashboard/ClientViewerBillings";
import { useCreatorPaymentMethods } from "@/hooks/useCreatorPaymentMethods";

export default function PayoutMethodsContent() {
  const creatorPaymentMethods = useCreatorPaymentMethods();

  return (
    <ClientViewerBillings
      onlyPaymentMethods
      creatorPaymentMethods={creatorPaymentMethods}
    />
  );
}
