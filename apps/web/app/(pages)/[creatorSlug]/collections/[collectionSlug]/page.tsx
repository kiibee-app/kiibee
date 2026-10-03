"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import ProfileFooter from "@/components/Feature/ProfileLayout/shared/Footer";
import SingleCollectionDetail from "@/components/Feature/SingleCollectionHero/SingleCollectionDetail";
import { PageContainer, Main } from "../../../../styles";

function CreatorCollectionContent() {
  const params = useParams();
  const rawCreatorSlug = params?.creatorSlug;
  const rawCollectionSlug = params?.collectionSlug;
  const creatorSlug = Array.isArray(rawCreatorSlug)
    ? rawCreatorSlug[0]
    : rawCreatorSlug;
  const collectionSlug = Array.isArray(rawCollectionSlug)
    ? rawCollectionSlug[0]
    : rawCollectionSlug;

  if (!creatorSlug || !collectionSlug) {
    return null;
  }

  return (
    <SingleCollectionDetail
      collectionId={collectionSlug}
      creatorSlug={creatorSlug}
    />
  );
}

export default function CreatorCollectionPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Suspense>
          <CreatorCollectionContent />
        </Suspense>
      </Main>
      <ProfileFooter />
    </PageContainer>
  );
}
