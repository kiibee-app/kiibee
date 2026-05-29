import React, { Suspense } from "react";
import type { Metadata } from "next";
import ClientDashboardViewer from "@/components/Feature/Dashboard/ClientDashboardViewer";
import { WEBSITE } from "@/utils/Constants";
import { isViewerCollectionsSectionExpanded } from "@/utils/viewerRented";

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

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardViewerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialCollectionsExpanded = isViewerCollectionsSectionExpanded(params);

  return (
    <Suspense fallback={<div />}>
      <ClientDashboardViewer
        initialCollectionsExpanded={initialCollectionsExpanded}
      />
    </Suspense>
  );
}
