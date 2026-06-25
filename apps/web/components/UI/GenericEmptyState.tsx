"use client";

import React from "react";
import styled from "styled-components";
import FolderIcon from "@/assets/icons/FolderIcon";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

const Container = styled.div<{ $bg?: string; $border?: string }>`
  display: flex;
  padding: 50px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  background: ${({ theme, $bg }) => {
    if ($bg === "white") return theme.colors.neutral.WHITE;
    if ($bg === "off_white") return theme.colors.neutral.OFF_WHITE;
    return $bg || theme.colors.neutral.OFF_WHITE;
  }};
  border: ${({ theme, $border }) => {
    if ($border === "gray") return `1px solid ${theme.colors.neutral.GRAY_200}`;
    return $border || "none";
  }};
`;

const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 640px;
  gap: 8px;
`;

const TitleText = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

const DescriptionText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin: 0;
  color: ${({ theme }) =>
    theme.colors.neutral.GRAY_500 ?? COLORS.neutral.GRAY_500};
`;

const FolderIconStyled = styled(FolderIcon).attrs({
  width: 54,
  height: 42,
  color: COLORS.neutral.GRAY_400,
})``;

type GenericEmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  bg?: string;
  border?: string;
};

export default function GenericEmptyState({
  title,
  description,
  icon,
  bg,
  border,
}: GenericEmptyStateProps) {
  return (
    <Container $bg={bg} $border={border}>
      {icon || <FolderIconStyled />}
      <ContentText>
        <TitleText>{title}</TitleText>
        {description && <DescriptionText>{description}</DescriptionText>}
      </ContentText>
    </Container>
  );
}
