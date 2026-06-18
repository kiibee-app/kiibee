import type { TFunction } from "i18next";
import {
  ACCESS_TYPE_FREE,
  BUY_COLLECTION_PREFIX,
  BUY_KEYWORDS,
  BUY_PREFIX,
  FREE_LABEL,
  RENT_PREFIX,
  VARIANT,
} from "./Constants";
import { pathPublishedContent } from "./path";
import type { FeedContentItem } from "./feedContentToTutorial";
import type { TutorialButton } from "./types";
import { CONTENT_RESPONSE_KEYS } from "./contentApi";

export type PricingLabels = {
  rent: string;
  buy: string;
  buyCollection: string;
  free: string;
};

export function getPricingLabels(t: TFunction): PricingLabels {
  return {
    rent: t("pricingLabels.rent"),
    buy: t("pricingLabels.buy"),
    buyCollection: t("pricingLabels.buyCollection"),
    free: t("pricingLabels.free"),
  };
}

export type ContentPricingAction = {
  label: string;
  fullWidth?: boolean;
};

export type ContentDetailPricingAction = {
  label: string;
  subtitle?: string;
  variant: (typeof VARIANT)[keyof typeof VARIANT];
};

export type ContentPrimaryAction = {
  label: string;
  isFree: boolean;
};

type PricingItem = Pick<
  FeedContentItem,
  "accessType" | "rentPrice" | "buyPrice"
>;

export function extractPriceNumber(priceLabel: string): number {
  return Number(priceLabel.replace(/[^0-9]/g, "")) || 0;
}

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

export function isBuyActionLabel(label: string): boolean {
  return BUY_KEYWORDS.some((keyword) => label.toLowerCase().includes(keyword));
}

export function isFreeContentItem(
  item: Pick<FeedContentItem, "accessType" | "rentPrice" | "buyPrice">,
): boolean {
  return (
    !formatPriceLabel(RENT_PREFIX, item.rentPrice) &&
    !formatPriceLabel(BUY_PREFIX, item.buyPrice)
  );
}

function resolvePricingPrefixes(labels?: PricingLabels) {
  return {
    rentPrefix: labels?.rent ?? RENT_PREFIX,
    buyPrefix: labels?.buy ?? BUY_PREFIX,
    buyCollectionPrefix: labels?.buyCollection ?? BUY_COLLECTION_PREFIX,
  };
}

function formatBuyPrice(
  buyPrice: string | number | null | undefined,
  inCollection: boolean | undefined,
  labels?: PricingLabels,
): string | null {
  const { buyPrefix, buyCollectionPrefix } = resolvePricingPrefixes(labels);
  return formatPriceLabel(
    inCollection ? buyCollectionPrefix : buyPrefix,
    buyPrice,
  );
}

export function resolveContentActionHref(
  contentId: string,
  actionLabel: string,
  item: Pick<FeedContentItem, "rentPrice" | "buyPrice">,
  actionsCount: number,
  options?: { inCollection?: boolean; labels?: PricingLabels },
): string {
  const href = pathPublishedContent(contentId);
  if (actionsCount <= 1) return href;

  const { rentPrefix, buyPrefix, buyCollectionPrefix } = resolvePricingPrefixes(
    options?.labels,
  );

  const rentLabel = formatPriceLabel(rentPrefix, item.rentPrice);
  const buyLabel = formatPriceLabel(buyPrefix, item.buyPrice);
  const collectionBuyLabel = formatPriceLabel(
    buyCollectionPrefix,
    item.buyPrice,
  );

  if (actionLabel === rentLabel) return `${href}#rent`;
  if (
    actionLabel === buyLabel ||
    (options?.inCollection && actionLabel === collectionBuyLabel)
  ) {
    return `${href}#buy`;
  }
  return href;
}

export function getContentPricingActions(
  item: Pick<FeedContentItem, "accessType" | "rentPrice" | "buyPrice">,
  freeLabel: string = FREE_LABEL,
  options?: { inCollection?: boolean; labels?: PricingLabels },
): ContentPricingAction[] {
  const isFree = item.accessType === ACCESS_TYPE_FREE;
  const { rentPrefix } = resolvePricingPrefixes(options?.labels);

  const rent = formatPriceLabel(rentPrefix, item.rentPrice);
  const buy = formatBuyPrice(
    item.buyPrice,
    options?.inCollection,
    options?.labels,
  );

  if (!rent && !buy) {
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

type DetailPricingItem = PricingItem & {
  rentDurationHours?: string | number | null;
};

function formatRentAccessSubtitle(
  rentDurationHours: string | number | null | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const hours = Number(rentDurationHours);
  if (!Number.isFinite(hours) || hours <= 0) {
    return t("singleContent.pricing.accessDefault");
  }

  const days = Math.round(hours / 24);
  if (days >= 30) {
    const months = Math.max(1, Math.round(days / 30));
    return t("singleContent.pricing.accessMonths", { count: months });
  }

  if (days >= 1) {
    return t("singleContent.pricing.accessDays", { count: days });
  }

  return t("singleContent.pricing.accessHours", { count: hours });
}

export function getContentDetailPricingActions(
  item: DetailPricingItem,
  t: (key: string, options?: Record<string, unknown>) => string,
  options?: { inCollection?: boolean; labels?: PricingLabels },
): ContentDetailPricingAction[] {
  if (isFreeContentItem(item)) {
    return [];
  }

  const { rentPrefix } = resolvePricingPrefixes(options?.labels);

  const rent = formatPriceLabel(rentPrefix, item.rentPrice);
  const buy = formatBuyPrice(
    item.buyPrice,
    options?.inCollection,
    options?.labels,
  );
  const actions: ContentDetailPricingAction[] = [];

  if (buy) {
    actions.push({
      label: buy,
      subtitle: t("singleContent.pricing.downloadFiles"),
      variant: VARIANT.PRIMARY,
    });
  }

  if (rent) {
    actions.push({
      label: rent,
      subtitle: formatRentAccessSubtitle(item.rentDurationHours, t),
      variant: VARIANT.SOFT_OUTLINE,
    });
  }

  return actions;
}

export function getContentPrimaryAction(
  item: PricingItem,
  seeContentLabel: string,
  freeLabel: string = FREE_LABEL,
  options?: { inCollection?: boolean; labels?: PricingLabels },
): ContentPrimaryAction {
  if (isFreeContentItem(item)) {
    return { label: seeContentLabel, isFree: true };
  }

  const { rentPrefix } = resolvePricingPrefixes(options?.labels);

  const rent = formatPriceLabel(rentPrefix, item.rentPrice);
  const buy = formatBuyPrice(
    item.buyPrice,
    options?.inCollection,
    options?.labels,
  );

  if (buy) {
    return { label: buy, isFree: false };
  }

  if (rent) {
    return { label: rent, isFree: false };
  }

  const actions = getContentPricingActions(item, freeLabel, options);
  return {
    label: actions[0]?.label ?? seeContentLabel,
    isFree: false,
  };
}

function extractPricingFromRecord(record: Record<string, unknown>) {
  return {
    accessType:
      (record[CONTENT_RESPONSE_KEYS.ACCESS_TYPE] as string | null) ?? undefined,
    buyPrice:
      (record[CONTENT_RESPONSE_KEYS.BUY_PRICE] as string | number | null) ??
      undefined,
    rentPrice:
      (record[CONTENT_RESPONSE_KEYS.RENT_PRICE] as string | number | null) ??
      undefined,
  };
}

export function buildPricingButtonsForContent(
  contentId: string,
  contentDetail: Record<string, unknown> | undefined,
  freeLabel: string,
): TutorialButton[] {
  if (!contentDetail) {
    return [{ label: freeLabel, variant: VARIANT.SECONDARY }];
  }

  const pricingItem = extractPricingFromRecord(contentDetail);

  if (isFreeContentItem(pricingItem)) {
    return [
      {
        label: freeLabel,
        variant: VARIANT.SECONDARY,
        href: pathPublishedContent(contentId),
      },
    ];
  }

  const actions = getContentPricingActions(pricingItem, freeLabel);

  return actions.map((action) => ({
    label: action.label,
    variant: VARIANT.SECONDARY,
    href: resolveContentActionHref(
      contentId,
      action.label,
      pricingItem,
      actions.length,
    ),
    fullWidth: action.fullWidth,
  }));
}
