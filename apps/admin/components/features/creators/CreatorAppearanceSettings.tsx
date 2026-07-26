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

const SECTION_META = [
  {
    title: "Layout",
    hint: "Choose which channel layout viewers see on the public profile.",
  },
  {
    title: "Colors",
    hint: "Text and button colors for the channel.",
  },
  {
    title: "Logo",
    hint: "Use channel name text or upload a logo image.",
  },
  {
    title: "Description",
    hint: "Shown on the creator channel profile.",
  },
  {
    title: "Cover images",
    hint: "Replace desktop or mobile covers if the current images look wrong.",
  },
  {
    title: "Receipt",
    hint: "Receipt message and support contact email.",
  },
] as const;

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
    : "Creator";

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
      setStatusMessage("Please select a valid image file.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateField(key, dataUrl);
    } catch {
      setStatusTone("error");
      setStatusMessage("Failed to read the selected image.");
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
      setStatusMessage(
        `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
      );
      return;
    }

    if (
      values.buttonColor === BUTTON_COLOR_VALUES.CUSTOM &&
      !/^#[0-9a-f]{6}$/i.test(values.buttonHex.trim())
    ) {
      setStatusTone("error");
      setStatusMessage("Enter a valid hex color (e.g. #1a2b3c).");
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
      setStatusMessage(
        "Creator appearance updated. Changes are live on the creator dashboard and public channel.",
      );
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to update creator appearance.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (creatorQuery.isLoading || appearanceQuery.isLoading) {
    return <LoadingState>Loading creator appearance…</LoadingState>;
  }

  if (creatorQuery.isError || !creatorQuery.data) {
    return (
      <ViewersState>
        {creatorQuery.error?.message || "Failed to load creator details."}
      </ViewersState>
    );
  }

  if (appearanceQuery.isError) {
    return (
      <ViewersState>
        {appearanceQuery.error?.message ||
          "Failed to load creator appearance settings."}
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
        Cancel
      </SecondaryButton>
      <PrimaryButton
        type="button"
        onClick={handleSave}
        disabled={!hasUnsavedChanges || isBusy}
      >
        <Save size={15} />
        {isBusy ? "Saving…" : "Save changes"}
      </PrimaryButton>
    </>
  );

  return (
    <AppearanceLayout>
      <BackLink href={`/all-creators/${creatorId}`}>
        <ArrowLeft size={16} />
        Back to creator details
      </BackLink>

      <AppearanceHero>
        <AppearanceHeaderCopy>
          <AppearanceEyebrow>
            <Palette size={12} />
            Channel appearance
          </AppearanceEyebrow>
          <AppearanceTitle>Update creator settings</AppearanceTitle>
          <AppearanceSubtitle>
            Edit layout, covers, and branding for {displayName}. Changes sync to
            the creator dashboard and public profile.
          </AppearanceSubtitle>
        </AppearanceHeaderCopy>
        <AppearanceActions>{actionButtons}</AppearanceActions>
      </AppearanceHero>

      {statusMessage ? (
        <StatusMessage $tone={statusTone}>{statusMessage}</StatusMessage>
      ) : null}

      <AppearancePanel>
        <SectionHeader index={1} {...SECTION_META[0]} />
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
                    <LayoutPreviewBars>
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
        <SectionHeader index={2} {...SECTION_META[1]} />
        <PanelBody>
          <FieldGrid>
            <Field>
              <FieldLabel>Text color</FieldLabel>
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
              <FieldLabel>Button color</FieldLabel>
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
              <FieldLabel>Custom button hex</FieldLabel>
              <ColorRow>
                <ColorSwatch
                  type="color"
                  value={
                    /^#[0-9a-f]{6}$/i.test(values.buttonHex)
                      ? values.buttonHex
                      : "#000000"
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
                  placeholder="#000000"
                />
              </ColorRow>
            </Field>
          ) : null}
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={3} {...SECTION_META[2]} />
        <PanelBody>
          <ToggleRow>
            <ToggleButton
              type="button"
              $active={values.logoType === LOGO_TYPE.TEXT}
              onClick={() => updateField("logoType", LOGO_TYPE.TEXT)}
            >
              Text
            </ToggleButton>
            <ToggleButton
              type="button"
              $active={values.logoType === LOGO_TYPE.PICTURE}
              onClick={() => updateField("logoType", LOGO_TYPE.PICTURE)}
            >
              Picture
            </ToggleButton>
          </ToggleRow>

          {values.logoType === LOGO_TYPE.TEXT ? (
            <Field>
              <FieldLabel>Logo name</FieldLabel>
              <TextInput
                value={values.logoName}
                maxLength={MAX_LOGO_NAME_LENGTH}
                onChange={(event) =>
                  updateField(
                    "logoName",
                    event.target.value.slice(0, MAX_LOGO_NAME_LENGTH),
                  )
                }
                placeholder="Channel name"
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
              <FieldLabel>Logo image</FieldLabel>
              <LogoPreview $empty={!values.logoUrl}>
                {values.logoUrl ? (
                  <PreviewImage src={values.logoUrl} alt="Logo preview" />
                ) : (
                  <PreviewPlaceholder>
                    <ImagePlus size={22} />
                    No logo uploaded
                  </PreviewPlaceholder>
                )}
              </LogoPreview>
              <ImageActions>
                <FileButton>
                  <ImagePlus size={14} />
                  Upload logo
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
                  Remove
                </DangerButton>
              </ImageActions>
            </Field>
          )}
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={4} {...SECTION_META[3]} />
        <PanelBody>
          <Field>
            <FieldLabel>Channel description</FieldLabel>
            <TextArea
              value={values.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value.slice(0, MAX_DESCRIPTION_LENGTH),
                )
              }
              placeholder="Describe this creator channel"
            />
            <CounterText>
              {values.description.length}/{MAX_DESCRIPTION_LENGTH}
            </CounterText>
          </Field>
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={5} {...SECTION_META[4]} />
        <PanelBody>
          <FieldGrid>
            <Field>
              <FieldLabel>Desktop cover</FieldLabel>
              <FieldHint>Recommended wide landscape image</FieldHint>
              <ImagePreview $empty={!values.desktopCoverImageUrl}>
                {values.desktopCoverImageUrl ? (
                  <PreviewImage
                    src={values.desktopCoverImageUrl}
                    alt="Desktop cover preview"
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImagePlus size={22} />
                    No desktop cover
                  </PreviewPlaceholder>
                )}
              </ImagePreview>
              <ImageActions>
                <FileButton>
                  <ImagePlus size={14} />
                  Upload desktop
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
                  Remove
                </DangerButton>
              </ImageActions>
            </Field>

            <Field>
              <FieldLabel>Mobile cover</FieldLabel>
              <FieldHint>Recommended taller mobile image</FieldHint>
              <ImagePreview $empty={!values.mobileCoverImageUrl}>
                {values.mobileCoverImageUrl ? (
                  <PreviewImage
                    src={values.mobileCoverImageUrl}
                    alt="Mobile cover preview"
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImagePlus size={22} />
                    No mobile cover
                  </PreviewPlaceholder>
                )}
              </ImagePreview>
              <ImageActions>
                <FileButton>
                  <ImagePlus size={14} />
                  Upload mobile
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
                  Remove
                </DangerButton>
              </ImageActions>
            </Field>
          </FieldGrid>
        </PanelBody>
      </AppearancePanel>

      <AppearancePanel>
        <SectionHeader index={6} {...SECTION_META[5]} />
        <PanelBody>
          <Field>
            <FieldLabel>Receipt message</FieldLabel>
            <TextArea
              value={values.receipt}
              maxLength={MAX_RECEIPT_LENGTH}
              onChange={(event) =>
                updateField(
                  "receipt",
                  event.target.value.slice(0, MAX_RECEIPT_LENGTH),
                )
              }
              placeholder="Shown on purchase receipts"
            />
            <CounterText>
              {values.receipt.length}/{MAX_RECEIPT_LENGTH}
            </CounterText>
          </Field>
          <Field>
            <FieldLabel>Support email</FieldLabel>
            <TextInput
              type="email"
              value={values.supportEmail}
              onChange={(event) =>
                updateField("supportEmail", event.target.value)
              }
              placeholder="support@example.com"
            />
          </Field>
        </PanelBody>
      </AppearancePanel>

      <StickyActions $visible={hasUnsavedChanges || isBusy}>
        <StickyHint>Unsaved appearance changes</StickyHint>
        {actionButtons}
      </StickyActions>
    </AppearanceLayout>
  );
}
