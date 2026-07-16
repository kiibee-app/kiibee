"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main, Section } from "../../styles";
import SingleCollectionHero from "@/components/Feature/SingleCollectionHero";

import GenericSpinner from "@/components/UI/GenericSpinner";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { useTutorialCollectionLookup } from "@/hooks/useTutorialVideos";
import { usePublicCollectionContent } from "@/hooks/usePublicCollectionContent";
import AccessGate from "@/components/Feature/AccessGate";
import { useCollectionAccessGate } from "@/hooks/useCollectionAccessGate";
import { VARIANT_CONTENT } from "@/utils/Constants";
import {
  HeroWrapper,
  TopBar,
  BackButtonWrapper,
} from "@/components/Feature/SingleCollectionHero/styles";
import GenericEmptyState from "@/components/UI/GenericEmptyState";
import { BackButtonIcon } from "@/assets/icons";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import {
  type CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { convertRentDurationToHours } from "@/utils/formatDate";
import { resolvePublicMediaUrl } from "@/utils/media";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { NAV } from "@/utils/translationKeys";

import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const publicCreatorId = searchParams.get("creatorId");
  const { collection: staticSection, isLoading: isTutorialCollectionLoading } =
    useTutorialCollectionLookup(id);

  const {
    data: dynamicSection,
    isLoading: isDynamicLoading,
    isError,
  } = usePublicCollectionContent(!staticSection ? id : null);

  const resolvedCreatorId = publicCreatorId || dynamicSection?.creatorId;

  const { creator: publicCreator } = useCreatorPublicProfile(
    resolvedCreatorId ?? null,
  );

  const publicCollectionsQuery = useGetAPI<CollectionsApiResponse>(
    resolvedCreatorId
      ? API.collection.getPublicByCreator(resolvedCreatorId)
      : API.collection.getAll,
    undefined,
    {
      enabled: Boolean(id && resolvedCreatorId && !staticSection),
      retry: false,
      refetchOnWindowFocus: false,
    },
  );
  const selectedCollection = useMemo(() => {
    if (!id || !publicCollectionsQuery.data) return undefined;
    return getCollectionRows(publicCollectionsQuery.data).find(
      (collection) => collection.id === id,
    );
  }, [id, publicCollectionsQuery.data]);

  const resolvedPricing = useMemo(() => {
    if (!selectedCollection) return undefined;
    return {
      accessType: selectedCollection.accessType,
      buyPrice: selectedCollection.buyPrice,
      rentPrice: selectedCollection.rentPrice,
      rentDurationHours: convertRentDurationToHours(
        selectedCollection.rentDuration,
      ),
    };
  }, [selectedCollection]);

  const resolvedDescription =
    dynamicSection?.description ?? selectedCollection?.description;

  const resolvedCreatorName =
    publicCreator?.name || dynamicSection?.creatorName;

  const resolvedCreatorAvatar = useMemo(() => {
    return resolvePublicMediaUrl(publicCreator?.profileImageUrl) ?? undefined;
  }, [publicCreator]);

  const resolvedImage =
    resolvePublicMediaUrl(selectedCollection?.coverImageUrl) ??
    dynamicSection?.heroImage;

  const { gateType, isLoading: isGateLoading } = useCollectionAccessGate(
    !staticSection ? id : null,
  );

  if (isTutorialCollectionLoading && !staticSection) {
    return <GenericSpinner isOverlay size={48} label={t("common.loading")} />;
  }

  if (staticSection) {
    return (
      <Section>
        <SingleCollectionHero
          title={staticSection.title}
          primaryContentId={staticSection.tutorials[0]?.id}
        />
        <CollectionContent
          videos={staticSection.tutorials}
          maxWidth={staticSection.gridMaxWidth}
        />
      </Section>
    );
  }

  if (isGateLoading || isDynamicLoading) {
    return <GenericSpinner isOverlay size={48} label={t("common.loading")} />;
  }

  if (gateType) {
    return (
      <Section>
        <SingleCollectionHero
          title={dynamicSection?.name ?? selectedCollection?.name ?? ""}
          description={resolvedDescription}
          creatorName={resolvedCreatorName}
          creatorAvatar={resolvedCreatorAvatar}
          image={resolvedImage}
          pricing={resolvedPricing}
          primaryContentId={dynamicSection?.videos?.[0]?.id}
        />
        <AccessGate
          type={gateType}
          variant={VARIANT_CONTENT}
          onSuccess={() => {
            if (id) {
              window.localStorage.setItem(
                `kiibee:gate:unlocked:collection:${id}`,
                "true",
              );
              window.location.reload();
            }
          }}
        />
      </Section>
    );
  }

  if (isError || !dynamicSection) {
    return (
      <HeroWrapper>
        <TopBar>
          <BackButtonWrapper onClick={() => router.back()}>
            <BackButtonIcon />
          </BackButtonWrapper>
        </TopBar>
        <GenericEmptyState
          title={t("singleCollection.noContent")}
          icon={
            <Image
              src={logo}
              alt={t(NAV.logoAlt)}
              width={30}
              height={30}
              priority
            />
          }
        />
      </HeroWrapper>
    );
  }

  return (
    <Section>
      <SingleCollectionHero
        title={dynamicSection.name}
        description={resolvedDescription}
        creatorName={resolvedCreatorName}
        creatorAvatar={resolvedCreatorAvatar}
        image={resolvedImage}
        imageFallback={dynamicSection.heroImageFallback}
        primaryContentId={dynamicSection.videos[0]?.id}
        pricing={resolvedPricing}
      />
      <CollectionContent videos={dynamicSection.videos} />
    </Section>
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
      <Footer />
    </PageContainer>
  );
}
