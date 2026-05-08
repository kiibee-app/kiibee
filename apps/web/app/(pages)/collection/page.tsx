import React, { Suspense } from "react";
import { SmoothScrollProvider } from "@/providers/smoothScrollProvider";
import ClientViewerCollection from "@/components/Feature/Dashboard/ClientViewerCollection";

export default function CollectionPage() {
  return (
    <Suspense fallback={<div />}>
      <SmoothScrollProvider>
        <ClientViewerCollection />
      </SmoothScrollProvider>
    </Suspense>
  );
}
