"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import SingleCollectionHero from "@/components/Feature/SingleCollectionHero";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import GenericSpinner from "@/components/UI/GenericSpinner";
import { useTutorialCollectionLookup } from "@/hooks/useTutorialVideos";
import { usePublicCollectionContent } from "@/hooks/usePublicCollectionContent";
import AccessGate from "@/components/Feature/AccessGate";
import { useCollectionAccessGate } from "@/hooks/useCollectionAccessGate";
import { useViewerCollectionAccess } from "@/hooks/useViewerContentAccess";
import {
  VARIANT_CONTENT,
  ORDER_TYPES,
  PAYMENT_QUERY_KEY,
  PAYMENT_ITEM_TYPE_QUERY_KEY,
  STATUS_TONE,
  VIEW,
  CONTENT_COLLECTION_QUERY_KEY,
  VIEWER_SECTION,
  VIEWER_SECTION_VALUES,
  ROLE_CREATOR,
  UNDEFINED_STRING,
  REDIRECT_NEXT_QUERY_PARAM,
  ACTION_LOGIN,
  ACTION_SIGNUP,
  REGISTER_SOURCE,
  TYPE_CODE,
} from "@/utils/Constants";
import { COLLECTION_ACCESS_STATUS } from "@/utils/viewerRented";
import { useLogout } from "@/hooks/auth/useLogout";
import { axiosClient } from "@/lib/http/axiosClient";
import {
  HeroWrapper,
  TopBar,
  BackButtonWrapper,
  Section as HeroSection,
} from "@/components/Feature/SingleCollectionHero/styles";
import GenericEmptyState from "@/components/UI/GenericEmptyState";
import { BackButtonIcon } from "@/assets/icons";
import { useGetAPI } from "@/lib/http/api/getApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { API } from "@/lib/http/api/endpoints";
import { useCreateCollectionOrder } from "@/hooks/useCreateCollectionOrder";
import { savePaymentReturnUrl } from "@/utils/paymentReturn";
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
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import PurchaseModal from "@/components/Feature/SingleContentPage/PurchaseModal";
import { LoginRequiredModal, GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MODAL_ALIGN } from "@/utils/ui";
import { toast } from "react-toastify";
import { PATHS, COLLECTION_ROUTE } from "@/utils/path";
import { CREATORS_LABELS, VIEWER_VIEW_VALUES } from "@/utils/SidebarItems";
import { Section } from "@/app/styles";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";

type Props = {
  collectionId: string;
  creatorId?: string | null;
  onBack?: () => void;
  showBack?: boolean;
  embedded?: boolean;
  onSelectContent?: (contentId: string) => void;
};

export default function SingleCollectionDetail({
  collectionId,
  creatorId: publicCreatorId = null,
  onBack,
  showBack = true,
  embedded = false,
  onSelectContent,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const id = collectionId;
  const user = useStoredLoginUser();
  const { getErrorMessage } = useApiErrorMessage();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [showCreatorModal1, setShowCreatorModal1] = useState(false);
  const [showCreatorModal2, setShowCreatorModal2] = useState(false);
  const [creatorModal2Action, setCreatorModal2Action] = useState<
    typeof ACTION_LOGIN | typeof ACTION_SIGNUP | null
  >(null);
  const { logout, isPending: isLoggingOut } = useLogout();

  const handleConfirmModal2 = async () => {
    const returnUrl =
      typeof window !== UNDEFINED_STRING
        ? window.location.pathname + window.location.search
        : "";
    const redirectUrl =
      creatorModal2Action === ACTION_SIGNUP
        ? `${PATHS.AUTH_SIGNUP_VIEWER}?${REDIRECT_NEXT_QUERY_PARAM}=${encodeURIComponent(returnUrl)}`
        : `${PATHS.AUTH_LOGIN}?${REDIRECT_NEXT_QUERY_PARAM}=${encodeURIComponent(returnUrl)}`;
    await logout(redirectUrl);
  };

  const handleCreatorModal1Confirm = () => {
    setCreatorModal2Action(ACTION_LOGIN);
    setShowCreatorModal2(true);
  };

  const handleCreatorModal1Cancel = () => {
    setCreatorModal2Action(ACTION_SIGNUP);
    setShowCreatorModal2(true);
  };

  const [selectedAction, setSelectedAction] = useState<
    (PricingAction & { rentalExpiresAt?: string }) | null
  >(null);

  const paymentStatus = searchParams?.get(PAYMENT_QUERY_KEY);
  const isPaymentSuccess = paymentStatus === STATUS_TONE.SUCCESS;
  const [dismissedPaymentSuccess, setDismissedPaymentSuccess] = useState(false);

  const { collection: staticSection, isLoading: isTutorialCollectionLoading } =
    useTutorialCollectionLookup(id);

  const viewerId = user?.id ?? readStoredLoginUser()?.id ?? null;

  const {
    data: dynamicSection,
    isLoading: isDynamicLoading,
    isError,
  } = usePublicCollectionContent(!staticSection ? id : null, viewerId);

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
    return (
      resolvePublicMediaUrl(
        publicCreator?.profileImageUrl || publicCreator?.mobileCoverImageUrl,
      ) ?? undefined
    );
  }, [publicCreator]);

  const resolvedImage =
    resolvePublicMediaUrl(selectedCollection?.coverImageUrl) ??
    dynamicSection?.heroImage ??
    dynamicSection?.videos?.[0]?.image;

  const { gateType, isLoading: isGateLoading } = useCollectionAccessGate(
    !staticSection ? id : null,
  );
  const {
    hasAccess: hasCollectionAccess,
    isPurchased,
    isRented,
  } = useViewerCollectionAccess(id);

  const userAccessStatus = isPurchased
    ? COLLECTION_ACCESS_STATUS.PURCHASED
    : isRented
      ? COLLECTION_ACCESS_STATUS.RENTED
      : null;

  const createCollectionOrderMutation = useCreateCollectionOrder();

  const handlePricingActionClick = (action: PricingAction) => {
    if (!user?.id) {
      setLoginModalVisible(true);
      return;
    }
    if (user?.role === ROLE_CREATOR) {
      setShowCreatorModal1(true);
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

    savePaymentReturnUrl();

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
    const nextParams = new URLSearchParams(searchParams?.toString() || "");
    nextParams.delete(PAYMENT_QUERY_KEY);
    const next = nextParams.toString();

    if (embedded) {
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
      return;
    }

    router.replace(next ? `${COLLECTION_ROUTE}?${next}` : COLLECTION_ROUTE, {
      scroll: false,
    });
  };

  const handlePaymentSuccessConfirm = () => {
    setDismissedPaymentSuccess(true);

    const paymentItemType = searchParams?.get(PAYMENT_ITEM_TYPE_QUERY_KEY);
    const isRental =
      paymentItemType === ORDER_TYPES.RENTAL ||
      (paymentItemType == null && selectedAction?.isPurchase === false);

    queryClient.removeQueries({
      queryKey: [isRental ? API.viewer.rentedData : API.viewer.purchasedData],
      exact: true,
    });

    const params = new URLSearchParams({
      [VIEWER_SECTION]: VIEWER_SECTION_VALUES.COLLECTIONS,
    });

    if (isRental) {
      params.set(VIEW, VIEWER_VIEW_VALUES.CURRENTLY_RENTED);
    }

    if (id) {
      params.set(CONTENT_COLLECTION_QUERY_KEY, id);
    }

    router.push(`${PATHS.DASHBOARD_VIEWER}?${params.toString()}`);
  };

  const handleSelectContent = (contentId: string) => {
    if (onSelectContent) {
      onSelectContent(contentId);
      return;
    }
    router.push(`/content/${encodeURIComponent(contentId)}`);
  };

  const heroPricing = hasCollectionAccess ? undefined : resolvedPricing;

  const handleCollectionGateSuccess = async (value: string, name?: string) => {
    if (!id || (gateType !== TYPE_CODE && !resolvedCreatorId)) return false;

    const request =
      gateType === TYPE_CODE
        ? axiosClient.post(API.content.verifyCode(id), { code: value })
        : axiosClient.post(API.creatorUsers.register, {
            creatorId: resolvedCreatorId,
            email: value,
            name,
            source: REGISTER_SOURCE.COLLECTION,
            sourceId: id,
          });

    await request;
    window.localStorage.setItem(
      `kiibee:gate:unlocked:collection:${id}`,
      "true",
    );
    window.location.reload();
    return true;
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
        message={t("createProfileHome.latestUpload.loginModal.message")}
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
        closeOnConfirm={false}
        buttonRow={true}
        size="sm"
        showCloseButton={false}
      />

      <GenericModal
        visible={showCreatorModal1}
        onClose={() => setShowCreatorModal1(false)}
        title={t("creatorPurchaseFlow.modal1.title")}
        message={t("creatorPurchaseFlow.modal1.message")}
        confirmLabel={t("creatorPurchaseFlow.modal1.primaryBtn")}
        cancelLabel={t("creatorPurchaseFlow.modal1.secondaryBtn")}
        onConfirm={handleCreatorModal1Confirm}
        onCancel={handleCreatorModal1Cancel}
        buttonRow={false}
        fullWidthButtons
      />

      <GenericModal
        visible={showCreatorModal2}
        onClose={() => setShowCreatorModal2(false)}
        title={t("creatorPurchaseFlow.modal2.title")}
        confirmLabel={t("creatorPurchaseFlow.modal2.primaryBtn")}
        cancelLabel={t("creatorPurchaseFlow.modal2.secondaryBtn")}
        onConfirm={handleConfirmModal2}
        onCancel={() => {
          setShowCreatorModal1(true);
        }}
        confirmLoading={isLoggingOut}
        confirmDisabled={isLoggingOut}
        buttonRow={true}
        fullWidthButtons
        closeOnConfirm={false}
      />
    </>
  );

  if (isTutorialCollectionLoading && !staticSection) {
    return <GenericSpinner isOverlay size={48} label={t("common.loading")} />;
  }

  if (staticSection) {
    return (
      <Section $embedded={embedded}>
        <SingleCollectionHero
          title={staticSection.title}
          onBack={onBack}
          showBack={showBack}
          embedded={embedded}
        />
        <CollectionContent
          videos={staticSection.tutorials}
          maxWidth={staticSection.gridMaxWidth}
          embedded={embedded}
          collectionId={id}
          onSelectVideo={embedded ? handleSelectContent : undefined}
        />
      </Section>
    );
  }

  if (isGateLoading || isDynamicLoading) {
    return <GenericSpinner isOverlay size={48} label={t("common.loading")} />;
  }

  if (gateType) {
    return (
      <Section $embedded={embedded}>
        <SingleCollectionHero
          title={dynamicSection?.name ?? selectedCollection?.name ?? ""}
          description={resolvedDescription}
          creatorName={resolvedCreatorName}
          creatorAvatar={resolvedCreatorAvatar}
          image={resolvedImage}
          pricing={resolvedPricing}
          onActionClick={handlePricingActionClick}
          isOwner={isOwner}
          onOpenDashboard={handleOpenDashboard}
          onBack={onBack}
          showBack={showBack}
          embedded={embedded}
          accessGate={
            <AccessGate
              type={gateType}
              variant={VARIANT_CONTENT}
              onSuccess={handleCollectionGateSuccess}
            />
          }
        />
        {purchaseModals}
      </Section>
    );
  }

  if (isError || !dynamicSection) {
    return (
      <HeroWrapper $embedded={embedded}>
        <TopBar $embedded={embedded}>
          {showBack ? (
            <BackButtonWrapper onClick={onBack ?? (() => router.back())}>
              <BackButtonIcon />
            </BackButtonWrapper>
          ) : null}
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
    <Section $embedded={embedded}>
      <SingleCollectionHero
        title={dynamicSection.name}
        description={resolvedDescription}
        creatorName={resolvedCreatorName}
        creatorAvatar={resolvedCreatorAvatar}
        image={resolvedImage}
        imageFallback={dynamicSection.heroImageFallback}
        pricing={heroPricing}
        onActionClick={
          hasCollectionAccess ? undefined : handlePricingActionClick
        }
        isOwner={isOwner}
        userAccessStatus={userAccessStatus}
        onOpenDashboard={handleOpenDashboard}
        onBack={onBack}
        showBack={showBack}
        embedded={embedded}
      />
      <CollectionContent
        videos={dynamicSection.videos}
        embedded={embedded}
        collectionId={id}
        onSelectVideo={embedded ? handleSelectContent : undefined}
      />
      {purchaseModals}
    </Section>
  );
}
