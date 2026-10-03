"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Save } from "lucide-react";
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

type CreatorSubscriptionSettingsProps = {
  creatorId: string;
};

export function CreatorSubscriptionSettings({
  creatorId,
}: CreatorSubscriptionSettingsProps) {
  const creatorQuery = useCreator(creatorId);
  const subscriptionQuery = useAdminSubscription(creatorId);
  const updateMutation = useUpdateAdminSubscription(creatorId);

  const [values, setValues] = useState<{
    planId: string;
    customPrice: string;
    customPrice3: string;
    customPrice6: string;
    customPrice12: string;
    customMaxFiles: string;
    customKiibeeCutDkk: string;
    customTransactionFeePct: string;
    paymentPeriod: string;
  }>({
    planId: "",
    customPrice: "",
    customPrice3: "",
    customPrice6: "",
    customPrice12: "",
    customMaxFiles: "",
    customKiibeeCutDkk: "",
    customTransactionFeePct: "",
    paymentPeriod: "",
  });

  const serverData = subscriptionQuery.data;

  useEffect(() => {
    if (serverData && !values.planId && serverData.plan?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues({
        planId: serverData.plan?.id || "",
        customPrice: serverData.overrides?.customPrice?.toString() || "",
        customPrice3: serverData.overrides?.customPrice3?.toString() || "",
        customPrice6: serverData.overrides?.customPrice6?.toString() || "",
        customPrice12: serverData.overrides?.customPrice12?.toString() || "",
        customMaxFiles: serverData.overrides?.customMaxFiles?.toString() || "",
        customKiibeeCutDkk:
          serverData.overrides?.customKiibeeCutDkk?.toString() || "",
        customTransactionFeePct:
          serverData.overrides?.customTransactionFeePct?.toString() || "",
        paymentPeriod: serverData.overrides?.paymentPeriod || "",
      });
    }
  }, [serverData, values.planId]);

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

  const handleSave = async () => {
    setStatusMessage(null);
    setStatusTone(undefined);

    const parseNumber = (val: string) =>
      val.trim() === "" ? null : Number(val);

    try {
      await updateMutation.mutateAsync({
        planId: values.planId,
        customPrice: parseNumber(values.customPrice),
        customPrice3: parseNumber(values.customPrice3),
        customPrice6: parseNumber(values.customPrice6),
        customPrice12: parseNumber(values.customPrice12),
        customMaxFiles: parseNumber(values.customMaxFiles),
        customKiibeeCutDkk: parseNumber(values.customKiibeeCutDkk),
        customTransactionFeePct: parseNumber(values.customTransactionFeePct),
        paymentPeriod: values.paymentPeriod.trim() || null,
      });

      setStatusTone("success");
      setStatusMessage("Subscription settings updated successfully.");
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
    <>
      <PrimaryButton type="button" onClick={handleSave} disabled={isBusy}>
        <Save size={15} />
        {isBusy ? "Saving..." : "Save Settings"}
      </PrimaryButton>
    </>
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
        <PanelBody>
          <Field>
            <FieldLabel>Plan ID</FieldLabel>
            <SelectInput
              value={values.planId}
              onChange={(e) => setValues({ ...values, planId: e.target.value })}
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
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <PanelHeader>
          <PanelIndex>02</PanelIndex>
          <PanelHeaderCopy>
            <PanelTitle>Custom Overrides</PanelTitle>
          </PanelHeaderCopy>
        </PanelHeader>
        <PanelBody>
          <FieldGrid>
            <Field>
              <FieldLabel>Price (Default)</FieldLabel>
              <FieldHint>Override the 1-month price</FieldHint>
              <TextInput
                type="number"
                value={values.customPrice}
                onChange={(e) =>
                  setValues({ ...values, customPrice: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Price (3 Months)</FieldLabel>
              <FieldHint>Override the 3-month price</FieldHint>
              <TextInput
                type="number"
                value={values.customPrice3}
                onChange={(e) =>
                  setValues({ ...values, customPrice3: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Price (6 Months)</FieldLabel>
              <FieldHint>Override the 6-month price</FieldHint>
              <TextInput
                type="number"
                value={values.customPrice6}
                onChange={(e) =>
                  setValues({ ...values, customPrice6: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Price (12 Months)</FieldLabel>
              <FieldHint>Override the 12-month price</FieldHint>
              <TextInput
                type="number"
                value={values.customPrice12}
                onChange={(e) =>
                  setValues({ ...values, customPrice12: e.target.value })
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
              <FieldLabel>Kiibee Cut (In DKK)</FieldLabel>
              <FieldHint>Fixed cut taken per transaction</FieldHint>
              <TextInput
                type="number"
                value={values.customKiibeeCutDkk}
                onChange={(e) =>
                  setValues({ ...values, customKiibeeCutDkk: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Transaction Fee (%)</FieldLabel>
              <FieldHint>Percentage cut taken per transaction</FieldHint>
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
              <FieldHint>Override allowed payment frequencies</FieldHint>
              <TextInput
                value={values.paymentPeriod}
                onChange={(e) =>
                  setValues({ ...values, paymentPeriod: e.target.value })
                }
              />
            </Field>
          </FieldGrid>
        </PanelBody>
      </AppearancePanel>

      <StickyActions $visible={isBusy}>
        <StickyHint>Don&apos;t forget to save your changes</StickyHint>
        {actionButtons}
      </StickyActions>
    </AppearanceLayout>
  );
}
