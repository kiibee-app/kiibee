"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import LoginSlide from "@/components/Feature/Auth/Login/LoginSlide";
import { AUTH_CREATOR } from "@/utils/translationKeys";
import {
  Card,
  Content,
  Description,
  RequestSentFormPanel,
  RequestSentLayout,
  RequestSentSlidePanel,
  Title,
} from "./styles";

export default function CreatorRequestSent() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <RequestSentLayout>
      <RequestSentFormPanel>
        <Content>
          <Card>
            <Title>
              <MonoText $use="H4_Medium">
                {t(AUTH_CREATOR.requestSent.title)}
              </MonoText>
            </Title>
            <Description>
              <MonoText $use="Body_Regular">
                {t(AUTH_CREATOR.requestSent.description)}
              </MonoText>
            </Description>
            <GenericButton onClick={() => router.push("/")}>
              {t(AUTH_CREATOR.requestSent.backToKiibee)}
            </GenericButton>
          </Card>
        </Content>
      </RequestSentFormPanel>
      <RequestSentSlidePanel>
        <LoginSlide />
      </RequestSentSlidePanel>
    </RequestSentLayout>
  );
}
