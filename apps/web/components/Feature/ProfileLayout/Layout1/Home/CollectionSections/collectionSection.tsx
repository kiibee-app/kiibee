import { LeftIcon } from "@/assets/icons";
import type { Layout1CollectionSection } from "@/utils/types";
import CollectionCardItem from "./collectionCardItem";
import { CardsGrid, SectionBlock, SectionHeader, SectionTitle } from "./styles";

type CollectionSectionProps = {
  section: Layout1CollectionSection;
};

export default function CollectionSection({ section }: CollectionSectionProps) {
  return (
    <SectionBlock>
      <SectionHeader>
        <SectionTitle>{section.title}</SectionTitle>
        <LeftIcon />
      </SectionHeader>

      <CardsGrid>
        {section.cards.map((card) => (
          <CollectionCardItem key={card.id} card={card} />
        ))}
      </CardsGrid>
    </SectionBlock>
  );
}
