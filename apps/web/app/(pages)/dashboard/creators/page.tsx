import React, { Suspense } from "react";
import ClientDashboardCreators from "@/components/Feature/Dashboard/ClientDashboardCreators";

export default function DashboardCreatorsPage() {
  return (
    <Suspense fallback={<div />}>
      <ClientDashboardCreators />
    </Suspense>
  );
}
