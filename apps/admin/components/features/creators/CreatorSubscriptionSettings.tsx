"use client";

import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Save } from "lucide-react";
import {
  useAdminSubscription,
  useUpdateAdminSubscription,
  useCreator,
} from "../../../hooks/api";
import {
  BackLink,
  LoadingState,
  ViewersState,
} from "../viewers/Viewers.styles";
import {
  AppearanceActions,
  AppearanceEyebrow,
  AppearanceHeaderCopy,
  AppearanceHero,
  AppearanceLayout,
  AppearancePanel,
  AppearanceSubtitle,
  AppearanceTitle,
  Field,
  FieldGrid,
  FieldHint,
  FieldLabel,
  PanelBody,
  PanelHeader,
  PanelHeaderCopy,
  PanelIndex,
  PanelTitle,
  PrimaryButton,
  SelectInput,
  StatusMessage,
  StickyActions,
  StickyHint,
  TextInput,
} from "./CreatorAppearanceSettings.styles";
import { useAllPlans } from "../../../hooks/api";

import {
  BasePlanBody,
  ManualPaymentSection,
  ManualPaymentRow,
  ManualPaymentButton,
  ManualPaymentExpiry,
} from "./CreatorSubscriptionSettings.styles";

type CreatorSubscriptionSettingsProps = {
  creatorId: string;
};

type SubscriptionFormValues = {
  planId: string;
  manuallyPaid: boolean;
  manualPaidExpiresAt: string;
  customPrice: string;
  customPrice3: string;
  customPrice6: string;
  customPrice12: string;
  customMaxFiles: string;
  customKiibeeCutPct: string;
  customTransactionFeePct: string;
  paymentPeriod: string;
};

function toSubscriptionPayload(values: SubscriptionFormValues) {
  const parseNumber = (value: string) =>
    value.trim() === "" ? null : Number(value);

  return {
    planId: values.planId,
    manuallyPaid: values.manuallyPaid,
    manualPaidExpiresAt:
      values.manuallyPaid && values.manualPaidExpiresAt
        ? values.manualPaidExpiresAt
        : null,
    customPrice: parseNumber(values.customPrice),
    customPrice3: parseNumber(values.customPrice3),
    customPrice6: parseNumber(values.customPrice6),
    customPrice12: parseNumber(values.customPrice12),
    customMaxFiles: parseNumber(values.customMaxFiles),
    customKiibeeCutPct: parseNumber(values.customKiibeeCutPct),
    customTransactionFeePct: parseNumber(values.customTransactionFeePct),
    paymentPeriod: values.paymentPeriod.trim() || null,
  };
}

export function CreatorSubscriptionSettings({
  creatorId,
}: CreatorSubscriptionSettingsProps) {
  const creatorQuery = useCreator(creatorId);
  const subscriptionQuery = useAdminSubscription(creatorId);
  const updateMutation = useUpdateAdminSubscription(creatorId);

  const [draft, setValues] = useState<SubscriptionFormValues | null>(null);
  const [savedValues, setSavedValues] = useState<SubscriptionFormValues | null>(
    null,
  );
  const serverData = subscriptionQuery.data;
  const overrides = serverData?.overrides;
  const configuredTerms = ([3, 6, 12] as const).filter(
    (months) => overrides?.[`customPrice${months}`] != null,
  );
  const storedPeriod = overrides?.paymentPeriod?.split(/[,;\s]+/)[0];
  const displayedPeriod =
    overrides?.customPrice == null &&
    configuredTerms.length === 1 &&
    (!storedPeriod || storedPeriod === "1")
      ? String(configuredTerms[0])
      : (storedPeriod ?? "1");
  const baseline = savedValues ?? {
    planId: serverData?.plan.id ?? "",
    manuallyPaid: overrides?.manuallyPaid ?? false,
    manualPaidExpiresAt: overrides?.manualPaidExpiresAt
      ? new Intl.DateTimeFormat("en-CA", {
          timeZone: "Europe/Copenhagen",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(
          new Date(new Date(overrides.manualPaidExpiresAt).getTime() - 1),
        )
      : "",
    customPrice: overrides?.customPrice?.toString() ?? "",
    customPrice3: overrides?.customPrice3?.toString() ?? "",
    customPrice6: overrides?.customPrice6?.toString() ?? "",
    customPrice12: overrides?.customPrice12?.toString() ?? "",
    customMaxFiles: overrides?.customMaxFiles?.toString() ?? "",
    customKiibeeCutPct: overrides?.customKiibeeCutPct?.toString() ?? "",
    customTransactionFeePct:
      overrides?.customTransactionFeePct?.toString() ?? "",
    paymentPeriod: displayedPeriod,
  };
  const values = draft ?? baseline;

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | undefined>(
    undefined,
  );

  const allPlansQuery = useAllPlans();

  if (
    creatorQuery.isLoading ||
    subscriptionQuery.isLoading ||
    allPlansQuery.isLoading
  ) {
    return <LoadingState>Loading subscription details...</LoadingState>;
  }

  if (creatorQuery.isError || !creatorQuery.data) {
    return (
      <ViewersState>
        {creatorQuery.error?.message || "Failed to load creator details"}
      </ViewersState>
    );
  }

  if (subscriptionQuery.isError) {
    return (
      <ViewersState>
        {subscriptionQuery.error?.message || "Failed to load subscription"}
      </ViewersState>
    );
  }

  const isBusy = updateMutation.isPending;

  const payload = toSubscriptionPayload(values);
  const savedPayload = toSubscriptionPayload(baseline);
  const hasUnsavedChanges = Object.keys(payload).some((key) => {
    const field = key as keyof typeof payload;
    return payload[field] !== savedPayload[field];
  });
  const invalidNumber = Object.entries(payload).find(
    ([key, value]) =>
      key.startsWith("custom") &&
      value !== null &&
      (typeof value !== "number" ||
        !Number.isSafeInteger(value) ||
        value < 0 ||
        (key.startsWith("customPrice") && value === 0) ||
        (["customTransactionFeePct", "customKiibeeCutPct"].includes(key) &&
          value > 100)),
  );
  const aliases: Record<string, number> = {
    monthly: 1,
    quarterly: 3,
    semiannual: 6,
    yearly: 12,
    annually: 12,
  };
  const invalidPeriod = Boolean(
    payload.paymentPeriod &&
    payload.paymentPeriod
      .toLowerCase()
      .split(/[,;\s]+/)
      .filter(Boolean)
      .some((part) => ![1, 3, 6, 12].includes(aliases[part] ?? Number(part))),
  );
  const validationError = invalidNumber
    ? "Use non-negative whole numbers. Prices must be greater than zero and fee percentages cannot exceed 100%."
    : invalidPeriod
      ? "Payment periods must be 1, 3, 6 or 12 months, separated by commas."
      : null;
  const canSave =
    Boolean(payload.planId) && hasUnsavedChanges && !isBusy && !validationError;

  const customStatus = overrides?.customSubscriptionStatus ?? "draft";
  const hasCustomPrice = [
    payload.customPrice,
    payload.customPrice3,
    payload.customPrice6,
    payload.customPrice12,
  ].some((value) => value != null);
  const canSaveCustom = Boolean(payload.planId) && !isBusy && !validationError;
  const canActivate =
    hasCustomPrice &&
    !isBusy &&
    !validationError &&
    Boolean(
      allPlansQuery.data?.some(
        (item) => item.id === values.planId && item.price > 0,
      ),
    );
  const handleSave = async (action?: "activate" | "cancel" | "save") => {
    if (
      action === "activate"
        ? !canActivate
        : action === "cancel"
          ? isBusy || customStatus !== "pending"
          : action === "save"
            ? !canSaveCustom
            : !canSave
    )
      return;

    setStatusMessage(null);
    setStatusTone(undefined);

    try {
      await updateMutation.mutateAsync({
        ...(action === "cancel" ? savedPayload : payload),
        ...(action ? { customSubscriptionAction: action } : {}),
      });
      if (action) {
        setValues(null);
        setSavedValues(null);
      } else setSavedValues(values);

      setStatusTone("success");
      setStatusMessage(
        action === "activate"
          ? "Custom subscription activated. The creator must complete payment to continue."
          : action === "cancel"
            ? "Custom offer cancelled. Existing paid ePay billing is unchanged."
            : action === "save"
              ? hasCustomPrice
                ? "Custom plan saved. The creator can view the card and choose Pay & Activate."
                : "File limit and payout fees updated on the current plan. No payment setup is required."
              : "Subscription settings updated successfully.",
      );
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to update subscription",
      );
    }
  };

  const actionButtons = (
    <PrimaryButton
      type="button"
      onClick={() => handleSave()}
      disabled={!canSave}
    >
      <Save size={15} />
      {isBusy ? "Saving..." : "Save Settings"}
    </PrimaryButton>
  );

  return (
    <AppearanceLayout>
      <BackLink href={`/all-creators/${creatorId}`}>
        <ArrowLeft size={16} />
        Back to Details
      </BackLink>

      <AppearanceHero>
        <AppearanceHeaderCopy>
          <AppearanceEyebrow>
            <CreditCard size={12} />
            Subscription Settings
          </AppearanceEyebrow>
          <AppearanceTitle>Manage Subscription</AppearanceTitle>
          <AppearanceSubtitle>
            Override specific subscription plans and limitations for{" "}
            {creatorQuery.data.email}
          </AppearanceSubtitle>
        </AppearanceHeaderCopy>
        <AppearanceActions>{actionButtons}</AppearanceActions>
      </AppearanceHero>

      {validationError && (
        <StatusMessage $tone="error" role="alert">
          {validationError}
        </StatusMessage>
      )}
      {statusMessage ? (
        <StatusMessage $tone={statusTone}>{statusMessage}</StatusMessage>
      ) : null}

      <AppearancePanel>
        <PanelHeader>
          <PanelIndex>01</PanelIndex>
          <PanelHeaderCopy>
            <PanelTitle>Base Plan</PanelTitle>
          </PanelHeaderCopy>
        </PanelHeader>
        <BasePlanBody>
          <Field>
            <FieldLabel>Plan ID</FieldLabel>
            <SelectInput
              value={values.planId}
              onChange={(e) =>
                setValues({
                  ...values,
                  planId: e.target.value,
                  manuallyPaid: false,
                  manualPaidExpiresAt: "",
                })
              }
            >
              <option value="" disabled>
                Select a plan
              </option>
              {allPlansQuery.data?.map(
                (plan: {
                  id: string;
                  name: string;
                  price: number;
                  currency: string;
                  billingCycle: string;
                }) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} ({plan.price} {plan.currency}/
                    {plan.billingCycle})
                  </option>
                ),
              )}
            </SelectInput>
          </Field>
          <ManualPaymentSection>
            <ManualPaymentRow>
              <ManualPaymentButton
                type="button"
                $active={values.manuallyPaid}
                aria-pressed={values.manuallyPaid}
                disabled={
                  isBusy ||
                  !allPlansQuery.data?.some(
                    (plan) => plan.id === values.planId && plan.price > 0,
                  )
                }
                onClick={() =>
                  setValues({
                    ...values,
                    manuallyPaid: !values.manuallyPaid,
                    manualPaidExpiresAt: "",
                  })
                }
              >
                {values.manuallyPaid && <Check size={14} aria-hidden="true" />}
                Paid Manually
              </ManualPaymentButton>
              <FieldHint>
                {values.manuallyPaid
                  ? "Manual payment enabled. Save to apply."
                  : "For payments received outside ePay."}
              </FieldHint>
            </ManualPaymentRow>
            {values.manuallyPaid && (
              <ManualPaymentExpiry>
                <Field>
                  <FieldLabel as="label" htmlFor="manual-payment-expiry">
                    Expiry date (optional)
                  </FieldLabel>
                  <TextInput
                    id="manual-payment-expiry"
                    type="date"
                    value={values.manualPaidExpiresAt}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        manualPaidExpiresAt: e.target.value,
                      })
                    }
                  />
                  <FieldHint>
                    Leave empty for no expiry. Access lasts through this date
                    (Danish time), then switches to Try Kiibee.
                  </FieldHint>
                </Field>
              </ManualPaymentExpiry>
            )}
          </ManualPaymentSection>
        </BasePlanBody>
      </AppearancePanel>

      <AppearancePanel>
        <PanelHeader>
          <PanelIndex>02</PanelIndex>
          <PanelHeaderCopy>
            <PanelTitle>Custom Overrides</PanelTitle>
            <FieldHint>
              File limits and payout fees apply as soon as you save. Custom
              pricing takes effect after successful payment. Your existing ePay
              agreement stays active until then.
            </FieldHint>
          </PanelHeaderCopy>
        </PanelHeader>
        <PanelBody>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ flex: "1 1 260px", display: "grid", gap: 6 }}>
              <FieldLabel>
                Custom subscription:{" "}
                {customStatus === "pending"
                  ? "Awaiting payment"
                  : customStatus === "paid"
                    ? "Paid / active"
                    : customStatus === "cancelled"
                      ? "Cancelled"
                      : "Draft"}
              </FieldLabel>
              <FieldHint>
                Save a custom price to show the offer on the creator’s profile.
                Activate to require payment. Cancel withdraws the pending offer
                and keeps the existing paid subscription.
              </FieldHint>
            </div>
            <PrimaryButton
              type="button"
              disabled={!canActivate}
              onClick={() => handleSave("activate")}
            >
              Activate custom subscription
            </PrimaryButton>
            <PrimaryButton
              type="button"
              disabled={isBusy || customStatus !== "pending"}
              onClick={() => handleSave("cancel")}
            >
              Cancel custom offer
            </PrimaryButton>
          </div>
          <FieldGrid>
            <Field>
              <FieldLabel>Price (Default)</FieldLabel>
              <FieldHint>1-month price excluding 25% VAT</FieldHint>
              <TextInput
                type="number"
                value={values.customPrice}
                onChange={(e) =>
                  setValues({
                    ...values,
                    customPrice: e.target.value,
                    ...(e.target.value ? { paymentPeriod: "1" } : {}),
                    ...(e.target.value
                      ? {
                          customPrice3: "",
                          customPrice6: "",
                          customPrice12: "",
                        }
                      : {}),
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Price (3 Months)</FieldLabel>
              <FieldHint>
                Price excluding 25% VAT, charged every 3 months (not a monthly
                price)
              </FieldHint>
              <TextInput
                type="number"
                value={values.customPrice3}
                onChange={(e) =>
                  setValues({
                    ...values,
                    customPrice3: e.target.value,
                    ...(e.target.value
                      ? { customPrice: "", customPrice6: "", customPrice12: "" }
                      : {}),
                    ...(e.target.value ? { paymentPeriod: "3" } : {}),
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Price (6 Months)</FieldLabel>
              <FieldHint>
                Price excluding 25% VAT, charged every 6 months (not a monthly
                price)
              </FieldHint>
              <TextInput
                type="number"
                value={values.customPrice6}
                onChange={(e) =>
                  setValues({
                    ...values,
                    customPrice6: e.target.value,
                    ...(e.target.value
                      ? { customPrice: "", customPrice3: "", customPrice12: "" }
                      : {}),
                    ...(e.target.value ? { paymentPeriod: "6" } : {}),
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Price (12 Months)</FieldLabel>
              <FieldHint>
                Price excluding 25% VAT, charged every 12 months (not a monthly
                price)
              </FieldHint>
              <TextInput
                type="number"
                value={values.customPrice12}
                onChange={(e) =>
                  setValues({
                    ...values,
                    customPrice12: e.target.value,
                    ...(e.target.value
                      ? { customPrice: "", customPrice3: "", customPrice6: "" }
                      : {}),
                    ...(e.target.value ? { paymentPeriod: "12" } : {}),
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Max Files</FieldLabel>
              <FieldHint>Override max allowed active files</FieldHint>
              <TextInput
                type="number"
                value={values.customMaxFiles}
                onChange={(e) =>
                  setValues({ ...values, customMaxFiles: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Kiibee Cut (%)</FieldLabel>
              {overrides?.customKiibeeCutDkk != null &&
                overrides.customKiibeeCutPct == null && (
                  <FieldHint>
                    Existing cut: {overrides.customKiibeeCutDkk} DKK. Enter a
                    percentage to replace it. Leaving this blank restores the
                    plan percentage when saved.
                  </FieldHint>
                )}
              <FieldHint>
                Percentage deducted per payout; replaces the standard platform
                percentage
              </FieldHint>
              <TextInput
                type="number"
                min={0}
                max={100}
                step={1}
                value={values.customKiibeeCutPct}
                onChange={(e) =>
                  setValues({ ...values, customKiibeeCutPct: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Transaction Fee (%)</FieldLabel>
              <FieldHint>
                Processing fee percentage deducted per payout
              </FieldHint>
              <TextInput
                type="number"
                value={values.customTransactionFeePct}
                onChange={(e) =>
                  setValues({
                    ...values,
                    customTransactionFeePct: e.target.value,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Payment Period</FieldLabel>
              <FieldHint>
                Choose the billing interval. The creator cannot change it.
              </FieldHint>
              <SelectInput
                value={values.paymentPeriod || "1"}
                onChange={(e) =>
                  setValues({ ...values, paymentPeriod: e.target.value })
                }
              >
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </SelectInput>
            </Field>
          </FieldGrid>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 24,
            }}
          >
            <PrimaryButton
              type="button"
              disabled={!canSaveCustom}
              onClick={() => handleSave("save")}
            >
              <Save size={15} /> Save custom plan
            </PrimaryButton>
          </div>
        </PanelBody>
      </AppearancePanel>

      <StickyActions
        $visible={Boolean(payload.planId) && (hasUnsavedChanges || isBusy)}
      >
        <StickyHint>Don&apos;t forget to save your changes</StickyHint>
        {actionButtons}
      </StickyActions>
    </AppearanceLayout>
  );
}
