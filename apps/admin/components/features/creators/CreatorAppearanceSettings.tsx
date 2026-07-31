"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Palette, Save } from "lucide-react";
import {
  readFileAsDataUrl,
  uploadAppearanceImage,
  useCreator,
  useCreatorAppearance,
  useUpdateCreatorAppearance,
} from "../../../hooks/api";
import type { AppearanceFormValues } from "../../../types/content-appearance";
import {
  areAppearanceValuesEqual,
  BUTTON_COLOR_OPTIONS,
  BUTTON_COLOR_VALUES,
  isCreatorLayoutKey,
  LAYOUT_OPTIONS,
  LOGO_TYPE,
  mapAppearanceFromApi,
  mapAppearanceToApi,
  MAX_DESCRIPTION_LENGTH,
  MAX_LOGO_NAME_LENGTH,
  MAX_RECEIPT_LENGTH,
  TEXT_COLOR_OPTIONS,
} from "../../../utils/appearance";
import {
  creatorAppearanceLabels,
  getCreatorAppearanceSubtitle,
  getDescriptionMaxError,
} from "../../../utils/creatorAppearanceLabels";
import { CREATOR_APPEARANCE_SECTIONS } from "../../../utils/creatorAppearanceSections";
import { CREATOR_LAYOUT_KEY } from "../../../utils/constants";
import { getExistingCreatorDisplayName } from "../../../utils/existingCreatorsConfig";
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
  ColorRow,
  ColorSwatch,
  CounterText,
  DangerButton,
  Field,
  FieldGrid,
  FieldHint,
  FieldLabel,
  FileButton,
  ImageActions,
  ImagePreview,
  LayoutCard,
  LayoutCardDescription,
  LayoutCardMeta,
  LayoutCardTitle,
  LayoutGrid,
  LayoutPreview,
  LayoutPreviewBars,
  LayoutSelectedBadge,
  LogoPreview,
  LogoTextPreview,
  PanelBody,
  PanelHeader,
  PanelHeaderCopy,
  PanelHint,
  PanelIndex,
  PanelTitle,
  PreviewImage,
  PreviewPlaceholder,
  PrimaryButton,
  SecondaryButton,
  SelectInput,
  StatusMessage,
  StickyActions,
  StickyHint,
  TextArea,
  TextInput,
  ToggleButton,
  ToggleRow,
} from "./CreatorAppearanceSettings.styles";

type CreatorAppearanceSettingsProps = {
  creatorId: string;
};

function SectionHeader({
  index,
  title,
  hint,
}: {
  index: number;
  title: string;
  hint: string;
}) {
  return (
    <PanelHeader>
      <PanelIndex>{String(index).padStart(2, "0")}</PanelIndex>
      <PanelHeaderCopy>
        <PanelTitle>{title}</PanelTitle>
        <PanelHint>{hint}</PanelHint>
      </PanelHeaderCopy>
    </PanelHeader>
  );
}

export function CreatorAppearanceSettings({
  creatorId,
}: CreatorAppearanceSettingsProps) {
  const labels = creatorAppearanceLabels;
  const creatorQuery = useCreator(creatorId);
  const appearanceQuery = useCreatorAppearance(creatorId);
  const updateMutation = useUpdateCreatorAppearance(creatorId);

  const layoutFallback = useMemo(() => {
    const layout = creatorQuery.data?.layout;
    return layout && isCreatorLayoutKey(layout) ? layout : undefined;
  }, [creatorQuery.data?.layout]);

  const serverValues = useMemo(
    () => mapAppearanceFromApi(appearanceQuery.data, layoutFallback),
    [appearanceQuery.data, layoutFallback],
  );

  const [values, setValues] = useState<AppearanceFormValues>(serverValues);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | undefined>(
    undefined,
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setValues(serverValues);
  }, [serverValues]);

  const hasUnsavedChanges = !areAppearanceValuesEqual(values, serverValues);
  const isBusy = updateMutation.isPending || isUploading;

  const displayName = creatorQuery.data
    ? getExistingCreatorDisplayName(creatorQuery.data)
    : labels.fallbackCreatorName;

  const updateField = <K extends keyof AppearanceFormValues>(
    key: K,
    value: AppearanceFormValues[K],
  ) => {
    setStatusMessage(null);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = async (
    file: File | null,
    key: "desktopCoverImageUrl" | "mobileCoverImageUrl" | "logoUrl",
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatusTone("error");
      setStatusMessage(labels.invalidImageFile);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateField(key, dataUrl);
    } catch {
      setStatusTone("error");
      setStatusMessage(labels.readImageFailed);
    }
  };

  const handleCancel = () => {
    setValues(serverValues);
    setStatusMessage(null);
    setStatusTone(undefined);
  };

  const handleSave = async () => {
    setStatusMessage(null);
    setStatusTone(undefined);

    if (values.description.length > MAX_DESCRIPTION_LENGTH) {
      setStatusTone("error");
      setStatusMessage(getDescriptionMaxError());
      return;
    }

    if (
      values.buttonColor === BUTTON_COLOR_VALUES.CUSTOM &&
      !/^#[0-9a-f]{6}$/i.test(values.buttonHex.trim())
    ) {
      setStatusTone("error");
      setStatusMessage(labels.invalidHex);
      return;
    }

    try {
      setIsUploading(true);
      const payload = mapAppearanceToApi(values);
      const [logoUrl, desktopCoverImageUrl, mobileCoverImageUrl] =
        await Promise.all([
          uploadAppearanceImage(payload.logoUrl),
          uploadAppearanceImage(payload.desktopCoverImageUrl),
          uploadAppearanceImage(payload.mobileCoverImageUrl),
        ]);

      await updateMutation.mutateAsync({
        ...payload,
        logoUrl,
        desktopCoverImageUrl,
        mobileCoverImageUrl,
      });

      setStatusTone("success");
      setStatusMessage(labels.saveSuccess);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : labels.saveFailed,
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (creatorQuery.isLoading || appearanceQuery.isLoading) {
    return <LoadingState>{labels.loading}</LoadingState>;
  }

  if (creatorQuery.isError || !creatorQuery.data) {
    return (
      <ViewersState>
        {creatorQuery.error?.message || labels.loadCreatorFailed}
      </ViewersState>
    );
  }

  if (appearanceQuery.isError) {
    return (
      <ViewersState>
        {appearanceQuery.error?.message || labels.loadAppearanceFailed}
      </ViewersState>
    );
  }

  const actionButtons = (
    <>
      <SecondaryButton
        type="button"
        onClick={handleCancel}
        disabled={!hasUnsavedChanges || isBusy}
      >
        {labels.cancel}
      </SecondaryButton>
      <PrimaryButton
        type="button"
        onClick={handleSave}
        disabled={!hasUnsavedChanges || isBusy}
      >
        <Save size={15} />
        {isBusy ? labels.saving : labels.save}
      </PrimaryButton>
    </>
  );

  return (
    <AppearanceLayout>
      <BackLink href={`/all-creators/${creatorId}`}>
        <ArrowLeft size={16} />
        {labels.backToDetails}
      </BackLink>

      <AppearanceHero>
        <AppearanceHeaderCopy>
          <AppearanceEyebrow>
            <Palette size={12} />
            {labels.eyebrow}
          </AppearanceEyebrow>
          <AppearanceTitle>{labels.pageTitle}</AppearanceTitle>
          <AppearanceSubtitle>
            {getCreatorAppearanceSubtitle(displayName)}
          </AppearanceSubtitle>
        </AppearanceHeaderCopy>
        <AppearanceActions>{actionButtons}</AppearanceActions>
      </AppearanceHero>

      {statusMessage ? (
        <StatusMessage $tone={statusTone}>{statusMessage}</StatusMessage>
      ) : null}

      <AppearancePanel>
        <SectionHeader index={1} {...CREATOR_APPEARANCE_SECTIONS[0]} />
        <PanelBody>
          <LayoutGrid>
            {LAYOUT_OPTIONS.map((option) => {
              const active = values.layout === option.key;
              return (
                <LayoutCard
                  key={option.key}
                  type="button"
                  $active={active}
                  aria-pressed={active}
                  onClick={() => updateField("layout", option.key)}
                >
                  <LayoutPreview $variant={option.key} $active={active}>
                    <LayoutPreviewBars
                      $visible={option.key !== CREATOR_LAYOUT_KEY.LAYOUT2}
                    >
                      <span />
                      <span />
                      <span />
                    </LayoutPreviewBars>
                  </LayoutPreview>
                  <LayoutCardMeta>
                    <LayoutCardTitle>
                      {option.label}
                      <LayoutSelectedBadge $active={active}>
                        <Check size={12} strokeWidth={3} />
                      </LayoutSelectedBadge>
                    </LayoutCardTitle>
                    <LayoutCardDescription>
                      {option.description}
                    </LayoutCardDescription>
                  </LayoutCardMeta>
                </LayoutCard>
              );
            })}
          </LayoutGrid>
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={2} {...CREATOR_APPEARANCE_SECTIONS[1]} />
        <PanelBody>
          <FieldGrid>
            <Field>
              <FieldLabel>{labels.textColor}</FieldLabel>
              <SelectInput
                value={values.textColor}
                onChange={(event) =>
                  updateField("textColor", event.target.value)
                }
              >
                {TEXT_COLOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field>
              <FieldLabel>{labels.buttonColor}</FieldLabel>
              <SelectInput
                value={values.buttonColor}
                onChange={(event) =>
                  updateField("buttonColor", event.target.value)
                }
              >
                {BUTTON_COLOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </FieldGrid>
          {values.buttonColor === BUTTON_COLOR_VALUES.CUSTOM ? (
            <Field>
              <FieldLabel>{labels.customButtonHex}</FieldLabel>
              <ColorRow>
                <ColorSwatch
                  type="color"
                  value={
                    /^#[0-9a-f]{6}$/i.test(values.buttonHex)
                      ? values.buttonHex
                      : labels.hexPlaceholder
                  }
                  onChange={(event) =>
                    updateField("buttonHex", event.target.value)
                  }
                />
                <TextInput
                  value={values.buttonHex}
                  onChange={(event) =>
                    updateField("buttonHex", event.target.value)
                  }
                  placeholder={labels.hexPlaceholder}
                />
              </ColorRow>
            </Field>
          ) : null}
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={3} {...CREATOR_APPEARANCE_SECTIONS[2]} />
        <PanelBody>
          <ToggleRow>
            <ToggleButton
              type="button"
              $active={values.logoType === LOGO_TYPE.TEXT}
              onClick={() => updateField("logoType", LOGO_TYPE.TEXT)}
            >
              {labels.logoText}
            </ToggleButton>
            <ToggleButton
              type="button"
              $active={values.logoType === LOGO_TYPE.PICTURE}
              onClick={() => updateField("logoType", LOGO_TYPE.PICTURE)}
            >
              {labels.logoPicture}
            </ToggleButton>
          </ToggleRow>

          {values.logoType === LOGO_TYPE.TEXT ? (
            <Field>
              <FieldLabel>{labels.logoName}</FieldLabel>
              <TextInput
                value={values.logoName}
                maxLength={MAX_LOGO_NAME_LENGTH}
                onChange={(event) =>
                  updateField(
                    "logoName",
                    event.target.value.slice(0, MAX_LOGO_NAME_LENGTH),
                  )
                }
                placeholder={labels.logoNamePlaceholder}
              />
              {values.logoName.trim() ? (
                <LogoTextPreview>{values.logoName.trim()}</LogoTextPreview>
              ) : null}
              <CounterText>
                {values.logoName.length}/{MAX_LOGO_NAME_LENGTH}
              </CounterText>
            </Field>
          ) : (
            <Field>
              <FieldLabel>{labels.logoImage}</FieldLabel>
              <LogoPreview $empty={!values.logoUrl}>
                {values.logoUrl ? (
                  <PreviewImage
                    src={values.logoUrl}
                    alt={labels.logoPreviewAlt}
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImagePlus size={22} />
                    {labels.noLogo}
                  </PreviewPlaceholder>
                )}
              </LogoPreview>
              <ImageActions>
                <FileButton>
                  <ImagePlus size={14} />
                  {labels.uploadLogo}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      void handleImageSelect(
                        event.target.files?.[0] ?? null,
                        "logoUrl",
                      );
                      event.target.value = "";
                    }}
                  />
                </FileButton>
                <DangerButton
                  type="button"
                  disabled={!values.logoUrl}
                  onClick={() => updateField("logoUrl", null)}
                >
                  {labels.remove}
                </DangerButton>
              </ImageActions>
            </Field>
          )}
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={4} {...CREATOR_APPEARANCE_SECTIONS[3]} />
        <PanelBody>
          <Field>
            <FieldLabel>{labels.channelDescription}</FieldLabel>
            <TextArea
              value={values.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value.slice(0, MAX_DESCRIPTION_LENGTH),
                )
              }
              placeholder={labels.descriptionPlaceholder}
            />
            <CounterText>
              {values.description.length}/{MAX_DESCRIPTION_LENGTH}
            </CounterText>
          </Field>
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={5} {...CREATOR_APPEARANCE_SECTIONS[4]} />
        <PanelBody>
          <FieldGrid>
            <Field>
              <FieldLabel>{labels.desktopCover}</FieldLabel>
              <FieldHint>{labels.desktopCoverHint}</FieldHint>
              <ImagePreview $empty={!values.desktopCoverImageUrl}>
                {values.desktopCoverImageUrl ? (
                  <PreviewImage
                    src={values.desktopCoverImageUrl}
                    alt={labels.desktopCoverAlt}
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImagePlus size={22} />
                    {labels.noDesktopCover}
                  </PreviewPlaceholder>
                )}
              </ImagePreview>
              <ImageActions>
                <FileButton>
                  <ImagePlus size={14} />
                  {labels.uploadDesktop}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      void handleImageSelect(
                        event.target.files?.[0] ?? null,
                        "desktopCoverImageUrl",
                      );
                      event.target.value = "";
                    }}
                  />
                </FileButton>
                <DangerButton
                  type="button"
                  disabled={!values.desktopCoverImageUrl}
                  onClick={() => updateField("desktopCoverImageUrl", null)}
                >
                  {labels.remove}
                </DangerButton>
              </ImageActions>
            </Field>

            <Field>
              <FieldLabel>{labels.mobileCover}</FieldLabel>
              <FieldHint>{labels.mobileCoverHint}</FieldHint>
              <ImagePreview $empty={!values.mobileCoverImageUrl}>
                {values.mobileCoverImageUrl ? (
                  <PreviewImage
                    src={values.mobileCoverImageUrl}
                    alt={labels.mobileCoverAlt}
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImagePlus size={22} />
                    {labels.noMobileCover}
                  </PreviewPlaceholder>
                )}
              </ImagePreview>
              <ImageActions>
                <FileButton>
                  <ImagePlus size={14} />
                  {labels.uploadMobile}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      void handleImageSelect(
                        event.target.files?.[0] ?? null,
                        "mobileCoverImageUrl",
                      );
                      event.target.value = "";
                    }}
                  />
                </FileButton>
                <DangerButton
                  type="button"
                  disabled={!values.mobileCoverImageUrl}
                  onClick={() => updateField("mobileCoverImageUrl", null)}
                >
                  {labels.remove}
                </DangerButton>
              </ImageActions>
            </Field>
          </FieldGrid>
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={6} {...CREATOR_APPEARANCE_SECTIONS[5]} />
        <PanelBody>
          <Field>
            <FieldLabel>{labels.receiptMessage}</FieldLabel>
            <TextArea
              value={values.receipt}
              maxLength={MAX_RECEIPT_LENGTH}
              onChange={(event) =>
                updateField(
                  "receipt",
                  event.target.value.slice(0, MAX_RECEIPT_LENGTH),
                )
              }
              placeholder={labels.receiptPlaceholder}
            />
            <CounterText>
              {values.receipt.length}/{MAX_RECEIPT_LENGTH}
            </CounterText>
          </Field>
          <Field>
            <FieldLabel>{labels.supportEmail}</FieldLabel>
            <TextInput
              type="email"
              value={values.supportEmail}
              onChange={(event) =>
                updateField("supportEmail", event.target.value)
              }
              placeholder={labels.supportEmailPlaceholder}
            />
          </Field>
        </PanelBody>
      </AppearancePanel>

      <StickyActions $visible={hasUnsavedChanges || isBusy}>
        <StickyHint>{labels.stickyHint}</StickyHint>
        {actionButtons}
      </StickyActions>
    </AppearanceLayout>
  );
}
