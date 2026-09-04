"use client";

import {
  CreatorTitle,
  Grid,
  LoadMoreRow,
  PageWrapper,
  EmptyState,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { EXPLORE_PAGE_SIZE, VARIANT } from "@/utils/Constants";
import GenericCard from "@/components/UI/GenericCard";
import Skeleton from "@/components/UI/Skeleton";
import { getCreatorCardImage } from "@/hooks/creators/useExploreCreators";
import type { ExploreCreator } from "@/types/exploreCreators";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { getNameInitials } from "@/hooks/auth/useStoredLoginUser";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

type Props = {
  creators: ExploreCreator[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  showLoadMoreButton?: boolean;
  onLoadMore?: () => void;
};

export default function ExploreCreators({
  creators,
  isLoading,
  isLoadingMore,
  showLoadMoreButton,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();

  if (isLoading && creators.length === 0) {
    return (
      <PageWrapper>
        <Grid>
          {Array.from({ length: Math.min(EXPLORE_PAGE_SIZE, 8) }).map(
            (_, i) => (
              <Skeleton.ExploreCreator key={i} />
            ),
          )}
        </Grid>
      </PageWrapper>
    );
  }

  if (!isLoading && creators.length === 0) {
    return (
      <PageWrapper>
        <EmptyState>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t(CREATORS.noCreatorsFound)}
          </MonoText>
        </EmptyState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Grid>
        {creators.map((creator, index) => {
          const image = getCreatorCardImage(creator);

          return (
            <GenericCard
              key={creator.id}
              coverImage
              imageAspectRatio={GENERIC_CARD_LAYOUT.IMAGE_ASPECT_RATIO}
              minHeight={GENERIC_CARD_LAYOUT.CREATOR_MIN_HEIGHT}
              image={image ?? undefined}
              imageInitials={image ? undefined : getNameInitials(creator.name)}
              alt={creator.name}
              imagePriority={index < 4}
              badge={
                creator.category ? (
                  <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
                    {creator.category}
                  </MonoText>
                ) : undefined
              }
              title={
                <CreatorTitle $use="Body_Medium">{creator.name}</CreatorTitle>
              }
              subtitle={
                creator.uploadCount > 0 ? (
                  <MonoText
                    $use="Body_SemiMedium"
                    color={COLORS.neutral.GRAY_400}
                  >
                    {t(CREATORS.uploadsCount, { count: creator.uploadCount })}
                  </MonoText>
                ) : undefined
              }
              footer={
                <GenericButton
                  asAnchor
                  href={getPublicCreatorProfilePath(creator.id, creator.layout)}
                  variant={VARIANT.SECONDARY}
                >
                  {t(CREATORS.viewProfile)}
                </GenericButton>
              }
            />
          );
        })}
      </Grid>

      {showLoadMoreButton && (
        <LoadMoreRow>
          <GenericButton
            onClick={onLoadMore}
            variant={VARIANT.PRIMARY}
            type="button"
            isLoading={Boolean(isLoadingMore)}
          >
            {t(CREATORS.loadMore)}
          </GenericButton>
        </LoadMoreRow>
      )}
    </PageWrapper>
  );
}
