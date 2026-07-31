"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  CREATOR_DOWNLOAD_LIMIT_OPTIONS,
  CREATOR_SETTINGS_TEXT,
  DEFAULT_CREATOR_DOWNLOAD_LIMIT,
  type CreatorDownloadLimit,
} from "@/utils/allCreators";
import { useDownloadLimit, useSetDownloadLimit } from "@/hooks/api";
import {
  CreatorSettingsActions,
  CreatorSettingsDescription,
  CreatorSettingsField,
  CreatorSettingsForm,
  CreatorSettingsLabel,
  CreatorSettingsPanel,
  CreatorSettingsSaveButton,
  CreatorSettingsSelect,
  CreatorSettingsSelectWrapper,
  CreatorSettingsTitle,
  SelectChevron,
} from "./CreatorSettings.styles";

export function CreatorSettings() {
  const { data, isLoading } = useDownloadLimit();
  const setLimitMutation = useSetDownloadLimit();

  const [userLimit, setUserLimit] = useState<CreatorDownloadLimit | null>(null);

  const downloadLimit =
    userLimit ??
    (data?.maxLimit !== undefined
      ? (String(data.maxLimit) as CreatorDownloadLimit)
      : DEFAULT_CREATOR_DOWNLOAD_LIMIT);

  const handleSave = async () => {
    try {
      await setLimitMutation.mutateAsync(Number(downloadLimit));
      toast.success(CREATOR_SETTINGS_TEXT.SUCCESS_MESSAGE);
      setUserLimit(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : CREATOR_SETTINGS_TEXT.ERROR_MESSAGE,
      );
    }
  };

  return (
    <CreatorSettingsPanel>
      <CreatorSettingsForm>
        <CreatorSettingsTitle>
          {CREATOR_SETTINGS_TEXT.TITLE}
        </CreatorSettingsTitle>
        <CreatorSettingsDescription>
          {CREATOR_SETTINGS_TEXT.DESCRIPTION}
        </CreatorSettingsDescription>

        <CreatorSettingsField>
          <CreatorSettingsLabel>
            {CREATOR_SETTINGS_TEXT.FIELD_LABEL}
            <CreatorSettingsSelectWrapper>
              <CreatorSettingsSelect
                value={downloadLimit}
                disabled={isLoading || setLimitMutation.isPending}
                onChange={(event) =>
                  setUserLimit(event.target.value as CreatorDownloadLimit)
                }
              >
                {CREATOR_DOWNLOAD_LIMIT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CreatorSettingsSelect>
              <SelectChevron aria-hidden="true" />
            </CreatorSettingsSelectWrapper>
          </CreatorSettingsLabel>
        </CreatorSettingsField>

        <CreatorSettingsActions>
          <CreatorSettingsSaveButton
            type="button"
            onClick={handleSave}
            disabled={isLoading || setLimitMutation.isPending}
          >
            {setLimitMutation.isPending
              ? CREATOR_SETTINGS_TEXT.SAVING_BUTTON
              : CREATOR_SETTINGS_TEXT.SAVE_BUTTON}
          </CreatorSettingsSaveButton>
        </CreatorSettingsActions>
      </CreatorSettingsForm>
    </CreatorSettingsPanel>
  );
}
