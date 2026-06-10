"use client";

import React from "react";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import {
  CancelButton,
  CreateButton,
  HeaderActions,
  SaveButton,
} from "./styles";
import {
  APPEARANCE,
  COUPONS,
  COLLECTIONS,
  ContentTab,
  SETTINGS,
  ADD_CONTENT_TABS,
} from "@/utils/common";
import COLORS from "@repo/ui/colors";

type Props = {
  activeTab: ContentTab;
  isCollectionContentMode?: boolean;
  onCreate: () => void;
  onCancel: () => void;
  onCreateCoupon?: () => void;
  onSave: () => void;
  isSaveDisabled?: boolean;
};

export default function ContentsHeaderAction({
  activeTab,
  isCollectionContentMode,
  onCreate,
  onCancel,
  onCreateCoupon,
  onSave,
  isSaveDisabled = false,
}: Props) {
  const { t } = useTranslation();

  if (activeTab === COLLECTIONS) {
    const label = isCollectionContentMode
      ? t("contents.actions.addContent")
      : t("contents.actions.createCollection");

    return (
      <CreateButton type="button" onClick={onCreate}>
        <PlusIcon width={16} height={16} color={COLORS.primary.WHITE} />
        <MonoText $use="Body_Medium" color="inherit">
          {label}
        </MonoText>
      </CreateButton>
    );
  }

  const isUploadMode = (Object.values(ADD_CONTENT_TABS) as string[]).includes(
    activeTab,
  );

  if (isUploadMode || activeTab === SETTINGS || activeTab === APPEARANCE) {
    return (
      <HeaderActions>
        <CancelButton type="button" onClick={onCancel}>
          <MonoText $use="Body_Medium" color="inherit">
            {t("common.cancel")}
          </MonoText>
        </CancelButton>
        <SaveButton type="button" onClick={onSave} disabled={isSaveDisabled}>
          <MonoText $use="Body_Medium" color="inherit">
            {t("common.save")}
          </MonoText>
        </SaveButton>
      </HeaderActions>
    );
  }

  if (activeTab === COUPONS) {
    return (
      <CreateButton type="button" onClick={onCreateCoupon}>
        <PlusIcon width={16} height={16} color={COLORS.primary.WHITE} />
        <MonoText $use="Body_Medium" color="inherit">
          {t("contents.actions.createCoupon")}
        </MonoText>
      </CreateButton>
    );
  }

  return null;
}
