"use client";

import { useState } from "react";
import {
  CREATOR_DOWNLOAD_LIMIT_OPTIONS,
  CREATOR_SETTINGS_TEXT,
  DEFAULT_CREATOR_DOWNLOAD_LIMIT,
  type CreatorDownloadLimit,
} from "@/utils/allCreators";
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
  const [downloadLimit, setDownloadLimit] = useState<CreatorDownloadLimit>(
    DEFAULT_CREATOR_DOWNLOAD_LIMIT,
  );

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
                onChange={(event) =>
                  setDownloadLimit(event.target.value as CreatorDownloadLimit)
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
          <CreatorSettingsSaveButton type="button">
            {CREATOR_SETTINGS_TEXT.SAVE_BUTTON}
          </CreatorSettingsSaveButton>
        </CreatorSettingsActions>
      </CreatorSettingsForm>
    </CreatorSettingsPanel>
  );
}
