import {
  ACCESS_TYPE_FREE,
  BUY_PREFIX,
  FREE_LABEL,
  RENT_PREFIX,
} from "./Constants";
import type { FeedContentItem } from "./feedContentToTutorial";

export type ContentPricingAction = {
  label: string;
  fullWidth?: boolean;
};

export function formatPriceLabel(
  prefix: string,
  price: string | number | null | undefined,
): string | null {
  if (price == null || price === "") return null;
  const num = Number(price);
  if (Number.isNaN(num) || num <= 0) return null;
  const amount = Number.isInteger(num) ? String(num) : String(Math.round(num));
  return `${prefix} ${amount} kr`;
}

export function getContentPricingActions(
  item: Pick<FeedContentItem, "accessType" | "rentPrice" | "buyPrice">,
  freeLabel: string = FREE_LABEL,
): ContentPricingAction[] {
  const isFree = item.accessType === ACCESS_TYPE_FREE;
  const rent = formatPriceLabel(RENT_PREFIX, item.rentPrice);
  const buy = formatPriceLabel(BUY_PREFIX, item.buyPrice);

  if (isFree || (!rent && !buy)) {
    return [{ label: freeLabel, fullWidth: true }];
  }

  const actions: ContentPricingAction[] = [];
  if (rent) actions.push({ label: rent });
  if (buy) actions.push({ label: buy });

  if (actions.length === 1) {
    actions[0] = { ...actions[0], fullWidth: true };
  }

  return actions;
}
