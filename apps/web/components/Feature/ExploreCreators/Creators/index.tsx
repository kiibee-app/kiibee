"use client";

import { Grid, LoadMoreRow, PageWrapper } from "./styles";
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
};

export default function ExploreCreators({ creators, isLoading }: Props) {
  const { t } = useTranslation();

  if (!isLoading && creators.length === 0) {
    return null;
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
                  variant={VARIANT.SECONDARY}
                >
                  {t(CREATORS.viewProfile)}
                </GenericButton>
              }
            />
          );
        })}
      </Grid>

      <LoadMoreRow>
        <GenericButton asAnchor href="#load" variant={VARIANT.PRIMARY}>
          {t(CREATORS.loadMore)}
        </GenericButton>
      </LoadMoreRow>
    </PageWrapper>
  );
}
