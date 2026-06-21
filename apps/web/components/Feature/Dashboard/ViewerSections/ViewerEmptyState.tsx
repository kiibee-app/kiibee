"use client";

import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { ShoppingBagIcon } from "@/assets/icons/shoppingBag";
import { RENTED_MODES, type RentedMode } from "@/utils/viewerRented";
import {
  ViewerEmptyStateBox,
  ViewerEmptyStateDescription,
  ViewerEmptyStateIconWrap,
  ViewerEmptyStateTitle,
} from "./styles";

type Props = {
  mode: RentedMode;
  variant?: "empty" | "search";
};

const EMPTY_STATE_MODE_KEYS = {
  [RENTED_MODES.PURCHASED]: "purchased",
  [RENTED_MODES.CURRENTLY]: "currently",
  [RENTED_MODES.PREVIOUSLY]: "previously",
} as const;

export default function ViewerEmptyState({ mode, variant = "empty" }: Props) {
  const { t } = useTranslation();
  const modeKey = EMPTY_STATE_MODE_KEYS[mode];
  const titleKey =
    variant === "search"
      ? "viewerRented.emptyStates.search.title"
      : `viewerRented.emptyStates.${modeKey}.title`;
  const descriptionKey =
    variant === "search"
      ? "viewerRented.emptyStates.search.description"
      : `viewerRented.emptyStates.${modeKey}.description`;

  return (
    <ViewerEmptyStateBox>
      <ViewerEmptyStateIconWrap>
        <ShoppingBagIcon
          width={28}
          height={28}
          color={COLORS.neutral.GRAY_400}
        />
      </ViewerEmptyStateIconWrap>
      <ViewerEmptyStateTitle>{t(titleKey)}</ViewerEmptyStateTitle>
      <ViewerEmptyStateDescription>
        {t(descriptionKey)}
      </ViewerEmptyStateDescription>
    </ViewerEmptyStateBox>
  );
}
