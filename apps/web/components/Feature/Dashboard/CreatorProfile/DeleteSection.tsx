"use client";

import React from "react";
import {
  Card,
  Fields,
  Action,
  DeleteAction,
  DeleteButton,
  TitleText,
  DescriptionText,
} from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
import { useTranslation } from "react-i18next";

type DeleteSectionProps = {
  onDelete?: () => void;
};

export default function DeleteSection({ onDelete }: DeleteSectionProps) {
  const { t } = useTranslation();

  const handleDelete = React.useCallback(() => {
    if (onDelete) return onDelete();
  }, [onDelete]);

  return (
    <Card>
      <Fields>
        <TitleText>{t(CREATOR_PROFILE.accountDeletionTitle)}</TitleText>

        <DescriptionText>
          {t(CREATOR_PROFILE.accountDeletionText)}
        </DescriptionText>

        <Action>
          <DeleteAction>
            <DeleteButton variant={VARIANT.PRIMARY} onClick={handleDelete}>
              {t(CREATOR_PROFILE.deleteAccount)}
            </DeleteButton>
          </DeleteAction>
        </Action>
      </Fields>
    </Card>
  );
}
