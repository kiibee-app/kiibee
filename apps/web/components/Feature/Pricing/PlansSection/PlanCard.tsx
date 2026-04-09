"use client";

import type { PlanCardProps } from "@/types/planCard";
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

export default function PlanCard({
  title,
  price,
  desc1,
  desc2,
  features,
  cta,
  highlight = false,
}: PlanCardProps) {
  return (
    <Card $highlight={highlight}>
      <PlanTitle>{title}</PlanTitle>
      <Divider />
      <PlanPrice>{price}</PlanPrice>

      <Description>{desc1}</Description>
      <Description>{desc2}</Description>

      <FeatureList>
        {features.map((feature, index) => (
          <FeatureItem key={`${title}-${index}`}>
            <TickIcon aria-hidden="true" />
            <FeatureText>{feature}</FeatureText>
          </FeatureItem>
        ))}
      </FeatureList>

      <PlanButton type="button">{cta}</PlanButton>
    </Card>
  );
}
