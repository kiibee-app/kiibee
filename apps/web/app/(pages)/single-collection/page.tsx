"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import ProfileFooter from "@/components/Feature/ProfileLayout/shared/Footer";
import { PageContainer, Main } from "../../styles";
import SingleCollectionDetail from "@/components/Feature/SingleCollectionHero/SingleCollectionDetail";

function SingleCollectionContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const publicCreatorId = searchParams.get("creatorId");

  if (!id) {
    return null;
  }

  return (
    <SingleCollectionDetail collectionId={id} creatorId={publicCreatorId} />
  );
}

export default function SingleCollectionPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Suspense>
          <SingleCollectionContent />
        </Suspense>
      </Main>
      <ProfileFooter />
    </PageContainer>
  );
}
