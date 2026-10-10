import DynamicProfileShell from "@/components/Feature/ProfileLayout/DynamicProfileShell";
import CollectionList from "@/components/Feature/ProfileLayout/shared/CollectionList";
import { Suspense } from "react";

export default function CreatorCollectionsPage() {
  return (
    <Suspense fallback={null}>
      <DynamicProfileShell>
        <CollectionList />
      </DynamicProfileShell>
    </Suspense>
  );
}
