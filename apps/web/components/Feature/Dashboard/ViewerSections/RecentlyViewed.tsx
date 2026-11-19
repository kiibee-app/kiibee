"use client";

import { useCreatorAccessGate } from "@/hooks/useCreatorAccessGate";
import LeftIcon from "@/assets/icons/LeftIcon";
import { useLocalizedPaths } from "@/hooks/useLocalizedPaths";
import { useRouter } from "next/navigation";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { getContentTypeLabel } from "@/utils/content";
import { VideoIcon, WebIcon, EpubIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import COLORS from "@repo/ui/colors";
import {
  CardTitle,
  CardCreator,
} from "@/components/Feature/TutorialVideos/TutorialCard/styles";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import {
  getContentType,
  getContentDetail,
  type ContentDetailResponse,
} from "@/utils/contentApi";
import { resolveContentThumbnailCandidates } from "@/utils/media";
import type { RecentlyViewedItem } from "@/utils/recentlyViewed";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readRecentlyViewed, syncRecentlyViewed } from "@/utils/recentlyViewed";
import { useQuery } from "@tanstack/react-query";
import GenericSpinner from "@/components/UI/GenericSpinner";
import { DashboardPageWrapper } from "@/components/Layout/Dashboard/styles";
import { MonoText } from "@/components/UI/Monotext";
import {
  PageHeader,
  HeaderBackButton,
  MediaGrid,
  MediaTypePill,
  ViewerEmptyStateBox,
  ViewerEmptyStateTitle,
  ViewerEmptyStateDescription,
} from "./styles";

export default function RecentlyViewed() {
  const { t } = useTranslation();
  const router = useRouter();
  const paths = useLocalizedPaths();
  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.replace(paths.HOME);
  };
  const user = useStoredLoginUser();
  const userId = user?.id;
  const history = useQuery({
    queryKey: [API.viewer.recentlyViewed, userId],
    enabled: Boolean(userId),
    queryFn: () => syncRecentlyViewed(userId!),
    staleTime: 0,
  });
  const items = history.data ?? (userId ? readRecentlyViewed(userId) : []);

  return (
    <DashboardPageWrapper>
      <PageHeader>
        <HeaderBackButton
          type="button"
          aria-label={t("common.goBack")}
          title={t("common.goBack")}
          onClick={handleBack}
        >
          <LeftIcon
            aria-hidden="true"
            style={{ transform: "rotate(180deg)" }}
          />
        </HeaderBackButton>
        <MonoText $use="H4_SemiBold">{t("sidebar.recentlyViewed")}</MonoText>
      </PageHeader>
      {userId && history.isPending && !items.length ? (
        <GenericSpinner />
      ) : userId && items.length ? (
        <MediaGrid>
          {items.map((item) => (
            <RecentlyViewedCard key={item.id} item={item} userId={userId} />
          ))}
        </MediaGrid>
      ) : (
        <ViewerEmptyStateBox>
          <ViewerEmptyStateTitle>
            {t("viewerRecent.emptyTitle")}
          </ViewerEmptyStateTitle>
          <ViewerEmptyStateDescription>
            {t("viewerRecent.emptyDescription")}
          </ViewerEmptyStateDescription>
        </ViewerEmptyStateBox>
      )}
    </DashboardPageWrapper>
  );
}

function RecentlyViewedCard({
  item,
  userId,
}: {
  item: RecentlyViewedItem;
  userId: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useGetAPI<ContentDetailResponse>(
    API.content.view(item.id, userId),
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );
  const content = getContentDetail(data);
  const profileGate = useCreatorAccessGate(content?.creatorId ?? null);
  const images = resolveContentThumbnailCandidates(
    content?.thumbnailUrl,
    content?.thumbnailLandscapeUrl,
    { preferLandscape: true },
  );
  const contentType = getContentType(content);
  const TypeIcon = {
    video: VideoIcon,
    audio: AudioFileIcon,
    pdf: PdfFileIcon,
    epub: EpubIcon,
    web: WebIcon,
  }[contentType];
  const openContent = () => router.push(item.href);
  if (!content || profileGate.isLoading || profileGate.gateType === "payment")
    return null;
  return (
    <GenericCard
      title={
        <CardTitle $use="H5_Medium">{content?.title || item.title}</CardTitle>
      }
      subtitle={
        item.creatorName ? (
          <CardCreator $use="Body_SemiMedium">{item.creatorName}</CardCreator>
        ) : undefined
      }
      image={images[0] || item.thumbnailUrl}
      imageFallback={images[1]}
      imageInitials={item.title.slice(0, 1).toUpperCase()}
      imageAspectRatio={GENERIC_CARD_LAYOUT.IMAGE_ASPECT_RATIO}
      alt={item.title}
      coverImage
      meta={
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
          {new Date(item.viewedAt).toLocaleDateString()}
        </MonoText>
      }
      onClick={openContent}
      footer={
        <GenericButton
          fullWidth
          onClick={(event) => {
            event.stopPropagation();
            openContent();
          }}
        >
          {t("viewerRecent.viewContent")}
        </GenericButton>
      }
    >
      {content?.contentType && (
        <MediaTypePill>
          <TypeIcon width={20} height={20} color={COLORS.neutral.BLACK} />
          <MonoText $use="Body_Bold">
            {getContentTypeLabel(contentType)}
          </MonoText>
        </MediaTypePill>
      )}
    </GenericCard>
  );
}
