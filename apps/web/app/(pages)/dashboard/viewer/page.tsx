import React, { Suspense } from "react";
import type { Metadata } from "next";
import ClientDashboardViewer from "@/components/Feature/Dashboard/ClientDashboardViewer";
import { WEBSITE } from "@/utils/Constants";

const title = "Viewer Dashboard";
const description =
  "Manage your purchased content and viewer activity on Kiibee.";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title,
    description,
    type: WEBSITE,
  },
};

export default function DashboardViewerPage() {
  return (
    <Suspense fallback={<div />}>
      <ClientDashboardViewer />
    </Suspense>
  );
}
