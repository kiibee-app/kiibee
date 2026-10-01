"use client";

import DynamicProfileShell from "@/components/Feature/ProfileLayout/DynamicProfileShell";
import ProfileHomeSections from "@/components/Feature/ProfileLayout/HomeSections";
import { Suspense } from "react";

export default function CreatorPage() {
  return (
    <Suspense fallback={null}>
      <DynamicProfileShell
        render={(layout) => <ProfileHomeSections variant={layout} />}
      />
    </Suspense>
  );
}
