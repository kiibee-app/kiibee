import type { TFunction } from "i18next";
import {
  ACCESS_TYPE_EMAIL_GATED,
  ACCESS_TYPE_FREE,
  ACCESS_TYPE_PAID,
  ACCESS_TYPE_PASSWORD,
  BUY_KEYWORDS,
  BUY_PREFIX,
  FREE_LABEL,
  GLOBAL_CONTENT_PAYMENT_SETTINGS_STORAGE_KEY,
  RENT_KEYWORDS,
  RENT_PREFIX,
  REQUEST_EMAIL_ACCESS,
  SET_PASSWORD_ACCESS,
  VARIANT,
  type CollectionAccessType,
} from "./Constants";
import { ADMISSION_REQUIREMENT_VALUES } from "./admissionRequirements";
import { storage } from "./storage";
import { pathPublishedContent } from "./path";
import type { FeedContentItem } from "./feedContentToTutorial";
import type { TutorialButton } from "./types";
import { CONTENT_RESPONSE_KEYS } from "./contentApi";

export const ACCESS_CODE_REQUIRED_LABEL = "Access code required";
export const EMAIL_REQUIRED_LABEL = "Email required";

export type PricingLabels = {
  rent: string;
  buy: string;
  buyCollection: string;
  free: string;
  accessCodeRequired: string;
  emailRequired: string;
};

export function getPricingLabels(t: TFunction): PricingLabels {
  return {
    rent: t("pricingLabels.rent"),
    buy: t("pricingLabels.buy"),
    buyCollection: t("pricingLabels.buyCollection"),
    free: t("pricingLabels.free"),
    accessCodeRequired: t("pricingLabels.accessCodeRequired"),
    emailRequired: t("pricingLabels.emailRequired"),
  };
}

export type GlobalPaymentSettingInput = {
  accessType?: string | null;
  rentalAmount?: string | number | null;
  purchaseAmount?: string | number | null;
  accessDuration?: string | null;
};

export function getStoredGlobalPaymentSettings():
  | GlobalPaymentSettingInput
  | undefined {
  try {
    const raw = storage.get(GLOBAL_CONTENT_PAYMENT_SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        accessType: ADMISSION_REQUIREMENT_VALUES.payment,
        rentalAmount: parsed.rentalAmount || null,
        purchaseAmount: parsed.purchaseAmount || null,
        accessDuration: parsed.accessDuration || null,
      };
    }
  } catch {}
  return undefined;
}

export function resolveCollectionPricing(
  collection: {
    accessType?: string | null;
    buyPrice?: number | string | null;
    rentPrice?: number | string | null;
    rentDuration?: string | null;
  },
  globalSetting:
    | GlobalPaymentSettingInput
    | undefined = getStoredGlobalPaymentSettings(),
) {
  const isGlobalPayment =
    globalSetting?.accessType === ADMISSION_REQUIREMENT_VALUES.payment ||
    globalSetting?.accessType === ACCESS_TYPE_PAID ||
    Boolean(globalSetting?.rentalAmount || globalSetting?.purchaseAmount);

  const hasCustomPricing =
    collection.rentPrice != null || collection.buyPrice != null;

  const rawAccessType =
    collection.accessType === ACCESS_TYPE_PAID ||
    (!hasCustomPricing &&
      isGlobalPayment &&
      (collection.accessType === ACCESS_TYPE_FREE || !collection.accessType))
      ? ACCESS_TYPE_PAID
      : (collection.accessType ??
        (isGlobalPayment ? ACCESS_TYPE_PAID : ACCESS_TYPE_FREE));

  const accessType: CollectionAccessType =
    rawAccessType === ACCESS_TYPE_PAID ||
    rawAccessType === ADMISSION_REQUIREMENT_VALUES.payment
      ? ACCESS_TYPE_PAID
      : rawAccessType === SET_PASSWORD_ACCESS ||
          rawAccessType === ACCESS_TYPE_PASSWORD
        ? ACCESS_TYPE_PASSWORD
        : rawAccessType === REQUEST_EMAIL_ACCESS ||
            rawAccessType === ACCESS_TYPE_EMAIL_GATED
          ? ACCESS_TYPE_EMAIL_GATED
          : ACCESS_TYPE_FREE;

  const rawRent =
    collection.rentPrice != null
      ? collection.rentPrice
      : isGlobalPayment && globalSetting?.rentalAmount != null
        ? globalSetting.rentalAmount
        : null;

  const rawBuy =
    collection.buyPrice != null
      ? collection.buyPrice
      : isGlobalPayment && globalSetting?.purchaseAmount != null
        ? globalSetting.purchaseAmount
        : null;

  const rentPrice = rawRent != null ? Number(rawRent) : null;
  const buyPrice = rawBuy != null ? Number(rawBuy) : null;

  const rentDuration =
    collection.rentDuration ??
    (isGlobalPayment ? (globalSetting?.accessDuration ?? null) : null);

  return {
    accessType,
    rentPrice,
    buyPrice,
    rentDuration,
  };
}

function isPasswordAccessType(accessType?: string | null): boolean {
  return (
    accessType === ACCESS_TYPE_PASSWORD || accessType === SET_PASSWORD_ACCESS
  );
}

function isEmailAccessType(accessType?: string | null): boolean {
  return (
    accessType === ACCESS_TYPE_EMAIL_GATED ||
    accessType === REQUEST_EMAIL_ACCESS
  );
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
  return `${prefix} ${String(num)} kr`;
}

export function isBuyActionLabel(label: string): boolean {
  return BUY_KEYWORDS.some((keyword) => label.toLowerCase().includes(keyword));
}

export function isRentActionLabel(label: string): boolean {
  return RENT_KEYWORDS.some((keyword) => label.toLowerCase().includes(keyword));
}

export function isFreeContentItem(
  item: Pick<FeedContentItem, "accessType" | "rentPrice" | "buyPrice">,
): boolean {
  if (
    isPasswordAccessType(item.accessType) ||
    isEmailAccessType(item.accessType) ||
    item.accessType === ACCESS_TYPE_PAID
  ) {
    return false;
  }

  return (
    item.accessType === ACCESS_TYPE_FREE ||
    (!formatPriceLabel(RENT_PREFIX, item.rentPrice) &&
      !formatPriceLabel(BUY_PREFIX, item.buyPrice))
  );
}

function resolvePricingPrefixes(labels?: PricingLabels) {
  return {
    rentPrefix: labels?.rent ?? RENT_PREFIX,
    buyPrefix: labels?.buy ?? BUY_PREFIX,
    buyCollectionPrefix: labels?.buyCollection ?? BUY_PREFIX,
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
  if (isPasswordAccessType(item.accessType)) {
    return [
      {
        label:
          options?.labels?.accessCodeRequired ?? ACCESS_CODE_REQUIRED_LABEL,
        fullWidth: true,
      },
    ];
  }

  if (isEmailAccessType(item.accessType)) {
    return [
      {
        label: options?.labels?.emailRequired ?? EMAIL_REQUIRED_LABEL,
        fullWidth: true,
      },
    ];
  }

  if (isFreeContentItem(item)) {
    return [{ label: freeLabel, fullWidth: true }];
  }

  const { rentPrefix } = resolvePricingPrefixes(options?.labels);

  const rent = formatPriceLabel(rentPrefix, item.rentPrice);
  const buy = formatBuyPrice(
    item.buyPrice,
    options?.inCollection,
    options?.labels,
  );

  if (!rent && !buy) {
    if (item.accessType === ACCESS_TYPE_PAID) {
      return [];
    }
    return [{ label: freeLabel, fullWidth: true }];
  }

  const actions: ContentPricingAction[] = [];
  if (buy) actions.push({ label: buy });
  if (rent) actions.push({ label: rent });

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
