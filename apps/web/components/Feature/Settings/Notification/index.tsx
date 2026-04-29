"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { MonoText } from "@/components/UI/Monotext";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";

import COLORS from "@repo/ui/colors";

import { Card, CardTop, TextBlock, Section, FieldBox } from "./styles";

import {
  DEFAULT_NOTIFICATION_VALUES,
  NOTIFICATION_FIELD,
  NOTIFICATION_OPTIONS,
  NOTIFICATION_RECIPIENT,
  NOTIFICATION_TYPE,
  notificationSettings,
} from "@/utils/notificationSettings";
import { INPUT_TYPE } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";

export default function NotificationContent() {
  const { t } = useTranslation();
  const [values, setValues] = useState(DEFAULT_NOTIFICATION_VALUES);
  const isFormType = values.type === NOTIFICATION_TYPE.FORM;
  const isOtherEmail = values.recipient === NOTIFICATION_RECIPIENT.OTHER_EMAIL;

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
                label=""
                options={NOTIFICATION_OPTIONS[item.key](t)}
                value={values[item.key]}
                onChange={(v) =>
                  setValues((prev) => ({
                    ...prev,
                    [item.key]: v,
                  }))
                }
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
              onChange={(v) =>
                setValues((prev) => ({
                  ...prev,
                  otherEmail: v as string,
                }))
              }
              placeholder={t("settings.notifications.enterEmail")}
            />
          </FieldBox>
        </Section>
      )}
    </Card>
  );
}
