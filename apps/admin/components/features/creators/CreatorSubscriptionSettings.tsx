"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, Save } from "lucide-react";
import {
  useAdminSubscription,
  useAllPlans,
  useCreator,
  useUpdateAdminSubscription,
} from "../../../hooks/api";
import type {
  AdminSubscriptionData,
  PlanData,
} from "../../../hooks/api/use-admin-subscription";
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

interface FormValues {
  planId: string;
  customPrice: string;
  customPrice3: string;
  customPrice6: string;
  customPrice12: string;
  customMaxFiles: string;
  customKiibeeCutDkk: string;
  customTransactionFeePct: string;
  paymentPeriod: string;
}

interface SubscriptionFormProps {
  creatorId: string;
  creatorEmail: string;
  creatorPlanName?: string | null;
  serverData?: AdminSubscriptionData | null;
  allPlans: PlanData[];
}

function SubscriptionForm({
  creatorId,
  creatorEmail,
  creatorPlanName,
  serverData,
  allPlans,
}: SubscriptionFormProps) {
  const updateMutation = useUpdateAdminSubscription(creatorId);

  const matchedPlan = allPlans.find(
    (p) => p.name?.toLowerCase() === creatorPlanName?.toLowerCase(),
  );

  const initialPlanId =
    serverData?.plan?.id || matchedPlan?.id || allPlans[0]?.id || "";

  const [values, setValues] = useState<FormValues>({
    planId: initialPlanId,
    customPrice:
      serverData?.overrides?.customPrice != null
        ? String(serverData.overrides.customPrice)
        : "",
    customPrice3:
      serverData?.overrides?.customPrice3 != null
        ? String(serverData.overrides.customPrice3)
        : "",
    customPrice6:
      serverData?.overrides?.customPrice6 != null
        ? String(serverData.overrides.customPrice6)
        : "",
    customPrice12:
      serverData?.overrides?.customPrice12 != null
        ? String(serverData.overrides.customPrice12)
        : "",
    customMaxFiles:
      serverData?.overrides?.customMaxFiles != null
        ? String(serverData.overrides.customMaxFiles)
        : "",
    customKiibeeCutDkk:
      serverData?.overrides?.customKiibeeCutDkk != null
        ? String(serverData.overrides.customKiibeeCutDkk)
        : "",
    customTransactionFeePct:
      serverData?.overrides?.customTransactionFeePct != null
        ? String(serverData.overrides.customTransactionFeePct)
        : "",
    paymentPeriod: serverData?.overrides?.paymentPeriod || "",
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | undefined>(
    undefined,
  );

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
    <PrimaryButton type="button" onClick={handleSave} disabled={isBusy}>
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
            {creatorEmail}
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
              {allPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} ({plan.price} {plan.currency}/{plan.billingCycle})
                </option>
              ))}
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

export function CreatorSubscriptionSettings({
  creatorId,
}: {
  creatorId: string;
}) {
  const creatorQuery = useCreator(creatorId);
  const subscriptionQuery = useAdminSubscription(creatorId);
  const allPlansQuery = useAllPlans();

  if (
    creatorQuery.isLoading ||
    subscriptionQuery.isLoading ||
    allPlansQuery.isLoading
  ) {
    return (
      <AppearanceLayout>
        <BackLink href={`/all-creators/${creatorId}`}>
          <ArrowLeft size={16} />
          Back to Details
        </BackLink>
        <LoadingState>Loading subscription details...</LoadingState>
      </AppearanceLayout>
    );
  }

  if (creatorQuery.isError || !creatorQuery.data) {
    return (
      <AppearanceLayout>
        <BackLink href="/all-creators">
          <ArrowLeft size={16} />
          Back to creators
        </BackLink>
        <ViewersState>
          {creatorQuery.error?.message || "Failed to load creator details"}
        </ViewersState>
      </AppearanceLayout>
    );
  }

  if (allPlansQuery.isError || !allPlansQuery.data) {
    return (
      <AppearanceLayout>
        <BackLink href={`/all-creators/${creatorId}`}>
          <ArrowLeft size={16} />
          Back to Details
        </BackLink>
        <ViewersState>
          {allPlansQuery.error?.message || "Failed to load subscription plans"}
        </ViewersState>
      </AppearanceLayout>
    );
  }

  return (
    <SubscriptionForm
      key={creatorId}
      creatorId={creatorId}
      creatorEmail={creatorQuery.data.email}
      creatorPlanName={creatorQuery.data.planName}
      serverData={subscriptionQuery.data}
      allPlans={allPlansQuery.data}
    />
  );
}
