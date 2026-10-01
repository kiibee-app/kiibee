import React, { Suspense } from "react";
import type { Metadata } from "next";
import ClientDashboardViewer from "@/components/Feature/Dashboard/ClientDashboardViewer";
import {
  WEBSITE,
  VIEWER_DASHBOARD_TITLE,
  VIEWER_DASHBOARD_DESCRIPTION,
} from "@/utils/Constants";
import { getViewerExpandedSection } from "@/utils/viewerRented";

const title = VIEWER_DASHBOARD_TITLE;
const description = VIEWER_DASHBOARD_DESCRIPTION;

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

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardViewerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialExpandedSection = getViewerExpandedSection(params);

  return (
    <Suspense fallback={<div />}>
      <ClientDashboardViewer initialExpandedSection={initialExpandedSection} />
    </Suspense>
  );
}
