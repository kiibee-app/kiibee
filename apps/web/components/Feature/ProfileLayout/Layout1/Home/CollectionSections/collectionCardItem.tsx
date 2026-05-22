import GenericCard from "@/components/UI/GenericCard";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import type { Layout1CollectionCard } from "@/utils/types";
import MediaMeta from "./MediaMeta";
import CollectionActions from "./collectionActions";

type CollectionCardItemProps = {
  card: Layout1CollectionCard;
};

export default function CollectionCardItem({ card }: CollectionCardItemProps) {
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
