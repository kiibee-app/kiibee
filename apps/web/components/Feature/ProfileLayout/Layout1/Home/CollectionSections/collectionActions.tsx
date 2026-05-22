import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import type { Layout1CollectionCard } from "@/utils/types";
import { OneActionRow, TwoActionRow } from "./styles";

type CollectionActionsProps = {
  card: Layout1CollectionCard;
};

export default function CollectionActions({ card }: CollectionActionsProps) {
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
