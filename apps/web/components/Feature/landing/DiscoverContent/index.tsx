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

export default function DiscoverContent() {
  const { t } = useTranslation();

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
          <DiscoverCard key={item.id} item={item} />
        ))}
      </GridContainer>

      <BottomCtaSection>
        <GenericButton>{t("discoverContent.ctaPrimary")}</GenericButton>
        <GenericButton href="/explore-creators" variant={VARIANT.SECONDARY}>
          {t("discoverContent.ctaSecondary")}
        </GenericButton>
      </BottomCtaSection>
    </Section>
  );
}
