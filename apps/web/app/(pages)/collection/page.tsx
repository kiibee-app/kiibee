import React, { Suspense } from "react";
import { SmoothScrollProvider } from "@/providers/smoothScrollProvider";
import CollectionList from "@/components/Feature/CreateProfileCollections/ColletionList";

export default function CollectionPage() {
  return (
    <Suspense fallback={<div />}>
      <SmoothScrollProvider>
        <CollectionList />
      </SmoothScrollProvider>
    </Suspense>
  );
}
