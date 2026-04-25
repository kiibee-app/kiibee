"use client";

import React from "react";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { Card, CardTop, TextBlock, Section, FieldBox, Row } from "./styles";
import COLORS from "@repo/ui/colors";
import { ArrowIcon } from "@/assets/icons";
import { Directions } from "@/utils/ui";
import { notificationSettings } from "@/utils/notificationSettings";

export default function NotificationContent() {
  const { t } = useTranslation();

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
      {notificationSettings.map((item, index) => (
        <Section key={index}>
          <TextBlock>
            <MonoText $use="Body_SemiBold">{t(item.title)}</MonoText>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {t(item.description)}
            </MonoText>
          </TextBlock>

          <FieldBox>
            <Row>
              <MonoText $use="Body_Medium">{t(item.value)}</MonoText>
              <ArrowIcon direction={Directions.RIGHT} />
            </Row>
          </FieldBox>
        </Section>
      ))}
    </Card>
  );
}
