"use client";

import { useTranslation } from "react-i18next";
import { discoverContentData } from "@/utils/discoverContent";
import {
  Section,
  HeaderSection,
  Title,
  Subtitle,
  GridContainer,
  BottomCtaSection,
} from "./styles";
import DiscoverCard from "./DiscoverCard";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";

export default function DiscoverContent() {
  const { t, i18n } = useTranslation();

  return (
    <Section>
      <HeaderSection>
        <Title>
          <MonoText $use="Heading2">{t("discoverContent.title")}</MonoText>
        </Title>
        <Subtitle>
          <MonoText $use="H4_Medium">{t("discoverContent.subtitle")}</MonoText>
        </Subtitle>
      </HeaderSection>

      <GridContainer>
        {discoverContentData.map((item) => (
          <DiscoverCard key={item.id} item={item} lng={i18n.language} />
        ))}
      </GridContainer>

      <BottomCtaSection>
        <GenericButton asAnchor href={PATHS.AUTH_SIGNUP}>
          {t("discoverContent.ctaPrimary")}
        </GenericButton>
        <GenericButton
          asAnchor
          href={PATHS.EXPLORE_CREATORS}
          variant={VARIANT.SECONDARY}
        >
          {t("discoverContent.ctaSecondary")}
        </GenericButton>
      </BottomCtaSection>
    </Section>
  );
}
