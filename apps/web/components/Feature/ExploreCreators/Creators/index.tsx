"use client";

import {
  Grid,
  LoadMoreRow,
  PageWrapper,
  EmptyState,
  SkeletonCard,
  SkeletonImage,
  SkeletonTitleRow,
  SkeletonAvatar,
  SkeletonTextBlock,
  SkeletonRow,
  CreatorSkeletonFooter,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
import GenericCard from "@/components/UI/GenericCard";
import {
  type ExploreCreator,
  getCreatorCardImage,
} from "@/hooks/creators/useExploreCreators";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { getNameInitials } from "@/hooks/auth/useStoredLoginUser";

type Props = {
  creators: ExploreCreator[];
  isLoading?: boolean;
  showLoadMoreButton?: boolean;
  onLoadMore?: () => void;
};

export default function ExploreCreators({
  creators,
  isLoading,
  showLoadMoreButton,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <PageWrapper>
        <Grid>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonImage />
              <SkeletonTitleRow>
                <SkeletonAvatar />
                <SkeletonTextBlock>
                  <SkeletonRow $width="70%" $height="16px" />
                  <SkeletonRow $width="100%" $height="12px" />
                  <SkeletonRow $width="50%" $height="12px" />
                </SkeletonTextBlock>
              </SkeletonTitleRow>
              <CreatorSkeletonFooter />
            </SkeletonCard>
          ))}
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
        {creators.map((creator) => {
          const image = getCreatorCardImage(creator);

          return (
            <GenericCard
              key={creator.id}
              coverImage
              image={image ?? undefined}
              imageInitials={image ? undefined : getNameInitials(creator.name)}
              alt={creator.name}
              badge={
                creator.category ? (
                  <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
                    {creator.category}
                  </MonoText>
                ) : undefined
              }
              title={<MonoText $use="Body_Medium">{creator.name}</MonoText>}
              subtitle={
                <MonoText $use="Body_Small">
                  {t(CREATORS.uploadsCount, { count: creator.uploadCount })}
                </MonoText>
              }
              footer={
                <GenericButton
                  asAnchor
                  href={getPublicCreatorProfilePath(creator.id)}
                  target="_blank"
                  rel="noopener noreferrer"
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
          >
            {t(CREATORS.loadMore)}
          </GenericButton>
        </LoadMoreRow>
      )}
    </PageWrapper>
  );
}
