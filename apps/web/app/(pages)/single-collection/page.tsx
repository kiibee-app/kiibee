"use client";

import { Suspense, useMemo, useState } from "react";
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
import {
  VARIANT_CONTENT,
  ORDER_TYPES,
  PAYMENT_QUERY_KEY,
  STATUS_TONE,
  VIEW,
  CONTENT_COLLECTION_QUERY_KEY,
} from "@/utils/Constants";
import {
  HeroWrapper,
  TopBar,
  BackButtonWrapper,
} from "@/components/Feature/SingleCollectionHero/styles";
import GenericEmptyState from "@/components/UI/GenericEmptyState";
import { BackButtonIcon } from "@/assets/icons";
import { useGetAPI } from "@/lib/http/api/getApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { API } from "@/lib/http/api/endpoints";
import { useCreateCollectionOrder } from "@/hooks/useCreateCollectionOrder";
import {
  type CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import type { PricingAction } from "@/types/collectionsType";
import {
  convertRentDurationToHours,
  calculateRentalExpiryDate,
} from "@/utils/formatDate";
import { resolvePublicMediaUrl } from "@/utils/media";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { NAV } from "@/utils/translationKeys";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import PurchaseModal from "@/components/Feature/SingleContentPage/PurchaseModal";
import { LoginRequiredModal, GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MODAL_ALIGN } from "@/utils/ui";
import { toast } from "react-toastify";
import { PATHS, COLLECTION_ROUTE } from "@/utils/path";
import { CREATORS_LABELS } from "@/utils/SidebarItems";

import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const publicCreatorId = searchParams.get("creatorId");
  const user = useStoredLoginUser();
  const { getErrorMessage } = useApiErrorMessage();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    (PricingAction & { rentalExpiresAt?: string }) | null
  >(null);

  const paymentStatus = searchParams.get(PAYMENT_QUERY_KEY);
  const isPaymentSuccess = paymentStatus === STATUS_TONE.SUCCESS;
  const [dismissedPaymentSuccess, setDismissedPaymentSuccess] = useState(false);

  const { collection: staticSection, isLoading: isTutorialCollectionLoading } =
    useTutorialCollectionLookup(id);

  const {
    data: dynamicSection,
    isLoading: isDynamicLoading,
    isError,
  } = usePublicCollectionContent(!staticSection ? id : null);

  const resolvedCreatorId = publicCreatorId || dynamicSection?.creatorId;

  const isOwner = Boolean(user?.id && resolvedCreatorId === user.id);

  const handleOpenDashboard = () => {
    const params = new URLSearchParams({
      [VIEW]: CREATORS_LABELS.CONTENTS,
    });
    if (id) {
      params.set(CONTENT_COLLECTION_QUERY_KEY, id);
    }
    router.push(`${PATHS.DASHBOARD_CREATOR}?${params.toString()}`);
  };

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
    dynamicSection?.heroImage ??
    dynamicSection?.videos?.[0]?.image;

  const { gateType, isLoading: isGateLoading } = useCollectionAccessGate(
    !staticSection ? id : null,
  );

  const createCollectionOrderMutation = useCreateCollectionOrder();

  const handlePricingActionClick = (action: PricingAction) => {
    if (!user?.id) {
      setLoginModalVisible(true);
      return;
    }
    const durationHours = resolvedPricing?.rentDurationHours;
    const rentalExpiresAt = !action.isPurchase
      ? calculateRentalExpiryDate(durationHours)
      : undefined;

    setSelectedAction({ ...action, rentalExpiresAt });
    setShowPurchaseModal(true);
  };

  const handlePurchaseConfirm = (
    couponCode?: string,
    subscriptionId?: string,
  ) => {
    if (!selectedAction || !id) return;

    if (!user?.id) {
      setLoginModalVisible(true);
      return;
    }

    createCollectionOrderMutation.mutate(
      {
        collectionId: id,
        itemType: selectedAction.isPurchase
          ? ORDER_TYPES.PURCHASE
          : ORDER_TYPES.RENTAL,
        ...(couponCode ? { couponCode } : {}),
        ...(subscriptionId ? { subscriptionId } : {}),
      },
      {
        onSuccess: (response) => {
          const paymentUrl = response?.data?.url;
          const orderId = response?.data?.orderId;

          if (!paymentUrl && subscriptionId && orderId) {
            setShowPurchaseModal(false);
            setSelectedAction(null);
            router.push(
              `/payment/success?orderId=${encodeURIComponent(orderId)}`,
            );
            return;
          }

          if (!paymentUrl) {
            const error = new Error("Payment URL missing");
            const message = getErrorMessage(error, "errors.saveChangesFailed");
            toast.error(message);
            return;
          }

          setShowPurchaseModal(false);
          setSelectedAction(null);
          window.location.assign(paymentUrl);
        },
        onError: (error) => {
          const message = getErrorMessage(error, "errors.saveChangesFailed");
          toast.error(message);
        },
      },
    );
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedAction(null);
  };

  const handleCloseLoginModal = () => setLoginModalVisible(false);

  const handlePaymentSuccessClose = () => {
    setDismissedPaymentSuccess(true);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete(PAYMENT_QUERY_KEY);
    const next = nextParams.toString();
    router.replace(next ? `${COLLECTION_ROUTE}?${next}` : COLLECTION_ROUTE, {
      scroll: false,
    });
  };

  const handlePaymentSuccessConfirm = () => {
    setDismissedPaymentSuccess(true);
    router.push(PATHS.DASHBOARD_VIEWER);
  };

  const purchaseModals = (
    <>
      <PurchaseModal
        visible={showPurchaseModal}
        onClose={handleClosePurchaseModal}
        onPurchase={handlePurchaseConfirm}
        onRequireLogin={() => setLoginModalVisible(true)}
        isLoggedIn={Boolean(user?.id)}
        title={dynamicSection?.name ?? selectedCollection?.name ?? ""}
        image={resolvedImage}
        imageAlt={dynamicSection?.name ?? selectedCollection?.name ?? ""}
        creator={resolvedCreatorName}
        contentType="collection"
        priceLabel={selectedAction?.label || ""}
        accessLabel={selectedAction?.subtitle}
        collectionId={id || undefined}
        elementCount={
          selectedCollection?.contentsCount ||
          dynamicSection?.videos.length ||
          0
        }
        isCollectionPurchase={Boolean(selectedAction?.isPurchase)}
        rentalDurationHours={resolvedPricing?.rentDurationHours}
        rentalExpiresAt={selectedAction?.rentalExpiresAt}
        loading={createCollectionOrderMutation.isPending}
      />

      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onSuccess={() => {
          handleCloseLoginModal();
        }}
      />

      <GenericModal
        visible={isPaymentSuccess && !gateType && !dismissedPaymentSuccess}
        icon={<SuccessModalIcon />}
        iconMargin="0 auto 8px"
        textAlign={MODAL_ALIGN.CENTER}
        title={t("singleContent.purchaseSuccessModal.title")}
        message={t("singleContent.purchaseSuccessModal.collectionMessage")}
        cancelLabel={t("singleContent.purchaseSuccessModal.goBack")}
        confirmLabel={t("singleContent.purchaseSuccessModal.goToCollection")}
        onCancel={handlePaymentSuccessClose}
        onConfirm={handlePaymentSuccessConfirm}
        onClose={handlePaymentSuccessClose}
        buttonRow={true}
        size="sm"
        showCloseButton={false}
      />
    </>
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
          onActionClick={handlePricingActionClick}
          isOwner={isOwner}
          onOpenDashboard={handleOpenDashboard}
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
        {purchaseModals}
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
        onActionClick={handlePricingActionClick}
        isOwner={isOwner}
        onOpenDashboard={handleOpenDashboard}
      />
      <CollectionContent videos={dynamicSection.videos} />
      {purchaseModals}
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
