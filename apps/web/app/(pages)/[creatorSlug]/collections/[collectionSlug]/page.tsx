"use client";

import { Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import ProfileFooter from "@/components/Feature/ProfileLayout/shared/Footer";
import SingleCollectionDetail from "@/components/Feature/SingleCollectionHero/SingleCollectionDetail";
import { PageContainer, Main } from "../../../../styles";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import { isBrowser } from "@/utils/ui";
import GenericSpinner from "@/components/UI/GenericSpinner";

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

  const { creator, isLoading } = useCreatorPublicProfile(creatorSlug ?? null);
  const storedUser = useStoredLoginUser();

  if (!creatorSlug || !collectionSlug) {
    return null;
  }

  if (isLoading) {
    return <GenericSpinner size={48} isOverlay />;
  }

  const currentUserId =
    storedUser?.id || (isBrowser ? readStoredLoginUser()?.id : null);
  const isOwner = Boolean(
    currentUserId &&
    creator?.id &&
    String(currentUserId).trim() === String(creator.id).trim(),
  );
  const uploadCount = Number(creator?.uploadCount ?? 0);
  const hasPublishedPublicContent =
    Number.isFinite(uploadCount) && uploadCount > 0;

  if (!creator || (!hasPublishedPublicContent && !isOwner)) {
    notFound();
  }

  return (
    <SingleCollectionDetail
      key={`${creatorSlug}:${collectionSlug}`}
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
