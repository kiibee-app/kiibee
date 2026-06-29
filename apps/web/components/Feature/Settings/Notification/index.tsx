"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import COLORS from "@repo/ui/colors";
import { Card, CardTop, TextBlock, Section, FieldBox } from "./styles";
import {
  DEFAULT_NOTIFICATION_VALUES,
  NOTIFICATION_OPTIONS,
  NOTIFICATION_FIELD,
  NOTIFICATION_RECIPIENT,
  NOTIFICATION_TYPE,
  notificationSettings,
  NotificationSettingKey,
  NotificationValues,
} from "@/utils/notificationSettings";
import { INPUT_TYPE } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";

type NotificationContentProps = {
  values: NotificationValues;
  onChange: (values: NotificationValues) => void;
};

export default function NotificationContent({
  values,
  onChange,
}: NotificationContentProps) {
  const { t } = useTranslation();
  const isFormType = values.type === NOTIFICATION_TYPE.FORM;
  const isOtherEmail = values.recipient === NOTIFICATION_RECIPIENT.OTHER_EMAIL;

  const handleSettingChange = (key: NotificationSettingKey, value: string) => {
    onChange({
      ...values,
      [key]: value,
      ...(key === NOTIFICATION_FIELD.TYPE && value === NOTIFICATION_TYPE.FORM
        ? {
            frequency: DEFAULT_NOTIFICATION_VALUES.frequency,
            recipient: DEFAULT_NOTIFICATION_VALUES.recipient,
            otherEmail: "",
          }
        : {}),
      ...(key === NOTIFICATION_FIELD.RECIPIENT &&
      value === NOTIFICATION_RECIPIENT.ACCOUNT_EMAIL
        ? { otherEmail: "" }
        : {}),
    } as NotificationValues);
  };

  const handleOtherEmailChange = (value: string | string[]) => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    onChange({
      ...values,
      otherEmail: normalizedValue,
    });
  };

  return (
    <Card>
      <CardTop>
        <TextBlock>
          <MonoText $use="Body_SemiBold">
            {t("settings.notifications.title")}
          </MonoText>

          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t("settings.notifications.subtitle")}
          </MonoText>
        </TextBlock>
      </CardTop>

      {notificationSettings.map((item) => {
        if (isFormType && item.key !== NOTIFICATION_FIELD.TYPE) return null;

        return (
          <Section key={item.key}>
            <TextBlock>
              <MonoText $use="Body_SemiBold">{t(item.title)}</MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(item.description)}
              </MonoText>
            </TextBlock>

            <FieldBox>
              <DropdownField
                options={NOTIFICATION_OPTIONS[item.key](t)}
                value={values[item.key]}
                onChange={(v) => handleSettingChange(item.key, v)}
              />
            </FieldBox>
          </Section>
        );
      })}

      {!isFormType && isOtherEmail && (
        <Section>
          <FieldBox>
            <InputField
              type={INPUT_TYPE.TEXTAREA}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              value={values.otherEmail}
              onChange={handleOtherEmailChange}
              placeholder={t("settings.notifications.enterEmail")}
            />
          </FieldBox>
        </Section>
      )}
    </Card>
  );
}
