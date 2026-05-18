"use client";

import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { LAYOUT1_COLLECTION_SECTIONS } from "@/utils/dummyData/collectionData";
import MediaMeta from "./MediaMeta";
import type { Layout1CollectionCard } from "@/utils/types";
import {
  SectionsWrap,
  SectionBlock,
  SectionHeader,
  SectionTitle,
  SectionArrow,
  CardsGrid,
  OneActionRow,
  TwoActionRow,
} from "./styles";

function CollectionActions({ card }: { card: Layout1CollectionCard }) {
  const actionButtons = card.actions.slice(0, 2);

  if (actionButtons.length === 1) {
    return (
      <OneActionRow>
        <GenericButton variant={VARIANT.SECONDARY} size="md" fullWidth>
          {actionButtons[0]?.label}
        </GenericButton>
      </OneActionRow>
    );
  }

  return (
    <TwoActionRow>
      {actionButtons.map((action) => (
        <GenericButton
          key={`${card.id}-${action.label}`}
          variant={VARIANT.SECONDARY}
          size="md"
          fullWidth
        >
          {action.label}
        </GenericButton>
      ))}
    </TwoActionRow>
  );
}

function CollectionCardItem({ card }: { card: Layout1CollectionCard }) {
  return (
    <GenericCard
      image={card.image}
      alt={card.title}
      badge={<MonoText $use="Body_Bold">{card.badge}</MonoText>}
      title={<MonoText $use="H5_Medium">{card.title}</MonoText>}
      subtitle={
        <>
          <MonoText $use="Body_Medium">{card.author}</MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {card.published}
          </MonoText>
        </>
      }
      footer={<CollectionActions card={card} />}
    >
      <MediaMeta mediaType={card.mediaType} mediaLabel={card.mediaLabel} />
    </GenericCard>
  );
}

export default function CollectionSections() {
  return (
    <SectionsWrap>
      {LAYOUT1_COLLECTION_SECTIONS.map((section) => (
        <SectionBlock key={section.id}>
          <SectionHeader>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionArrow>›</SectionArrow>
          </SectionHeader>

          <CardsGrid>
            {section.cards.map((card) => (
              <CollectionCardItem key={card.id} card={card} />
            ))}
          </CardsGrid>
        </SectionBlock>
      ))}
    </SectionsWrap>
  );
}
