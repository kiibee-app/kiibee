import React, { Suspense } from "react";
import ClientDashboardViewer from "@/components/Feature/Dashboard/ClientDashboardViewer";

export default function DashboardViewerPage() {
  return (
    <Suspense fallback={<div />}>
      <ClientDashboardViewer />
    </Suspense>
  );
}
