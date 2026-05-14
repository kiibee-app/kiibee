"use client";

import { Grid, PageWrapper } from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { CreatorProfile } from "@/utils/sortOptions";
import { VARIANT } from "@/utils/Constants";
import GenericCard from "@/components/UI/GenericCard";
import { PATHS } from "@/utils/path";

type Props = {
  creators: CreatorProfile[];
};

export default function ExploreCreators({ creators }: Props) {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <Grid>
        {creators.map((creator) => (
          <GenericCard
            key={creator.id}
            image={creator.image}
            width="290px"
            badge={
              <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
                {creator.category}
              </MonoText>
            }
            title={<MonoText $use="Body_Medium">{creator.name}</MonoText>}
            subtitle={
              <MonoText $use="Body_Small">{creator.uploads} uploads</MonoText>
            }
            footer={
              <GenericButton
                asAnchor
                href={PATHS.DASHBOARD_CREATOR_PROFILE}
                variant={VARIANT.SECONDARY}
              >
                {t(CREATORS.viewProfile)}
              </GenericButton>
            }
          />
        ))}
      </Grid>

      <GenericButton asAnchor href="#load" variant={VARIANT.PRIMARY}>
        {t(CREATORS.loadMore)}
      </GenericButton>
    </PageWrapper>
  );
}
