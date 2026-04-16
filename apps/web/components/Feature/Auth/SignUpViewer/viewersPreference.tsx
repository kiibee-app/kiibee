"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { ContentWrap } from "@/app/auth/signup-creator/styles";
import {
  Description,
  PrepCard,
  PreContentWrap,
  Title,
  Wrapper,
} from "./styles";

export default function ViewerPreference() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <PreContentWrap>
      <ContentWrap>
        <AuthBackButton href="/auth/signup-viewer" />
      </ContentWrap>
      <Wrapper>
        <PrepCard>
          <Title>
            <MonoText $use="H4_Medium">
              {t("viewerSignup.preference.title")}
            </MonoText>
          </Title>

          <Description>
            <MonoText $use="Body_Medium">
              {t("viewerSignup.preference.description")}
            </MonoText>
          </Description>

          <GenericButton onClick={() => router.push("/")}>
            {t("viewerSignup.preference.submit")}
          </GenericButton>
        </PrepCard>
      </Wrapper>
    </PreContentWrap>
  );
}
