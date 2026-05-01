"use client";

import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { Card, Description, SuccessBox, Title, Wrapper } from "./styles";
import { PATHS } from "@/utils/path";
import { useRouter } from "next/navigation";

export default function ResetPasswordSuccess() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Wrapper>
      <Card>
        <SuccessBox>
          <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
          <Title>{t("resetPassword.successTitle")}</Title>
          <Description>
            <MonoText $use="Body_Regular">
              {t("resetPassword.successDescription")}
            </MonoText>
          </Description>
          <GenericButton onClick={() => router.push(PATHS.AUTH_LOGIN)}>
            {t("resetPassword.backToLogin")}
          </GenericButton>
        </SuccessBox>
      </Card>
    </Wrapper>
  );
}
