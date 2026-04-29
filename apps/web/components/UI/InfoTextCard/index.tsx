"use client";

import { Card, CardDescription, CardTitle } from "./styles";

type InfoTextCardProps = {
  title: string;
  description: string;
  withTopSpacing?: boolean;
};

export default function InfoTextCard({
  title,
  description,
  withTopSpacing = false,
}: InfoTextCardProps) {
  return (
    <Card $withTopSpacing={withTopSpacing}>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}
