"use client";

import {
  Card,
  Description,
  Divider,
  FeatureItem,
  FeatureList,
  FeatureText,
  PlanButton,
  PlanPrice,
  PlanTitle,
  TickIcon,
} from "./styles";
import { PATHS } from "@/utils/path";
import { useRouter } from "next/navigation";

export interface PlanCardProps {
  title: string;
  price: string;
  descriptions: string[];
  features: string[];
  cta: string;
  highlight?: boolean;
}

export default function PlanCard({
  title,
  price,
  descriptions,
  features,
  cta,
  highlight = false,
}: PlanCardProps) {
  const router = useRouter();

  return (
    <Card $highlight={highlight}>
      <PlanTitle>{title}</PlanTitle>
      <Divider />
      <PlanPrice>{price}</PlanPrice>

      {descriptions.map((desc, i) => (
        <Description key={i}>{desc}</Description>
      ))}

      <FeatureList>
        {features.map((feature) => (
          <FeatureItem key={feature}>
            <TickIcon aria-hidden="true" />
            <FeatureText>{feature}</FeatureText>
          </FeatureItem>
        ))}
      </FeatureList>

      <PlanButton
        type="button"
        onClick={() => router.push(PATHS.AUTH_SIGNUP_CREATOR)}
      >
        {cta}
      </PlanButton>
    </Card>
  );
}
