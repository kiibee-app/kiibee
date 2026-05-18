"use client";

import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { EpubIcon, PdfFileIcon, VideoIcon, WebIcon } from "@/assets/icons";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { LAYOUT1_COLLECTION_SECTIONS } from "@/utils/dummyData/collectionData";
import { FORMAT_TYPE } from "@/utils/types";
import type {
  Layout1CollectionCard,
  Layout1CollectionMediaType,
} from "@/utils/types";
import {
  SectionsWrap,
  SectionBlock,
  SectionHeader,
  SectionTitle,
  SectionArrow,
  CardsGrid,
  MetaPill,
  OneActionRow,
  TwoActionRow,
} from "./styles";

function iconForMediaType(type: Layout1CollectionMediaType) {
  if (type === FORMAT_TYPE.PDF) {
    return <PdfFileIcon width={18} height={18} color={COLORS.neutral.BLACK} />;
  }
  if (type === FORMAT_TYPE.EPUB) {
    return <EpubIcon width={18} height={18} color={COLORS.neutral.BLACK} />;
  }
  if (type === FORMAT_TYPE.WEB) {
    return <WebIcon width={18} height={18} color={COLORS.neutral.BLACK} />;
  }
  return <VideoIcon width={18} height={18} color={COLORS.neutral.BLACK} />;
}

function renderActionButtons(card: Layout1CollectionCard) {
  if (card.actions.length === 1) {
    return (
      <OneActionRow>
        <GenericButton variant={VARIANT.SECONDARY} size="md" fullWidth>
          {card.actions[0]?.label}
        </GenericButton>
      </OneActionRow>
    );
  }

  return (
    <TwoActionRow>
      {card.actions.slice(0, 2).map((action) => (
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
              <GenericCard
                key={card.id}
                image={card.image}
                alt={card.title}
                badge={<MonoText $use="Body_Bold">{card.badge}</MonoText>}
                title={<MonoText $use="H5_Medium">{card.title}</MonoText>}
                subtitle={
                  <>
                    <MonoText $use="Body_Medium">{card.author}</MonoText>
                    <MonoText
                      $use="Body_Medium"
                      color={COLORS.neutral.GRAY_400}
                    >
                      {card.published}
                    </MonoText>
                  </>
                }
                footer={renderActionButtons(card)}
              >
                <MetaPill>
                  {iconForMediaType(card.mediaType)}
                  <MonoText $use="Body_Bold">{card.mediaLabel}</MonoText>
                </MetaPill>
              </GenericCard>
            ))}
          </CardsGrid>
        </SectionBlock>
      ))}
    </SectionsWrap>
  );
}
