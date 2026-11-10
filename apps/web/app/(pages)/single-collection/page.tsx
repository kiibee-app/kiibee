"use client";

import { Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import ProfileFooter from "@/components/Feature/ProfileLayout/shared/Footer";
import { PageContainer, Main } from "../../styles";
import SingleCollectionDetail from "@/components/Feature/SingleCollectionHero/SingleCollectionDetail";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import { isBrowser } from "@/utils/ui";
import GenericSpinner from "@/components/UI/GenericSpinner";

function SingleCollectionContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("name") || searchParams.get("id");
  const publicCreatorId = searchParams.get("creatorId");

  const { creator, isLoading } = useCreatorPublicProfile(
    publicCreatorId ?? null,
  );
  const storedUser = useStoredLoginUser();

  if (!id) {
    return null;
  }

  if (publicCreatorId) {
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
