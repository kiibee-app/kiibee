"use client";

import { useRouter } from "next/navigation";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import LoginSlide from "@/components/Feature/Auth/Login/LoginSlide";
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

  return (
    <RequestSentLayout>
      <RequestSentFormPanel>
        <Content>
          <Card>
            <Title>
              <MonoText $use="H4_Medium">
                Thank you! Your request has been sent.
              </MonoText>
            </Title>
            <Description>
              <MonoText $use="Body_Regular">
                We&apos;ll review your information and get back to you within
                1-2 business days.
              </MonoText>
            </Description>
            <GenericButton onClick={() => router.push("/")}>
              Back to Kiibee
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
