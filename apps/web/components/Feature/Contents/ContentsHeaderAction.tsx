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
} from "@/utils/common";
import COLORS from "@repo/ui/colors";

type Props = {
  activeTab: ContentTab;
  onCreate: () => void;
  onCancel: () => void;
  onCreateCoupon?: () => void;
  onSave: () => void;
};

export default function ContentsHeaderAction({
  activeTab,
  onCreate,
  onCancel,
  onCreateCoupon,
  onSave,
}: Props) {
  const { t } = useTranslation();

  if (activeTab === COLLECTIONS) {
    return (
      <CreateButton type="button" onClick={onCreate}>
        <PlusIcon width={16} height={16} color={COLORS.primary.WHITE} />
        <MonoText $use="Body_Medium" color="inherit">
          {t("contents.actions.createCollection")}
        </MonoText>
      </CreateButton>
    );
  }

  if (activeTab === SETTINGS || activeTab === APPEARANCE) {
    return (
      <HeaderActions>
        <CancelButton type="button" onClick={onCancel}>
          <MonoText $use="Body_Medium" color="inherit">
            {t("common.cancel")}
          </MonoText>
        </CancelButton>
        <SaveButton type="button" onClick={onSave}>
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
