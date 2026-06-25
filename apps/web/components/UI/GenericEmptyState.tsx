"use client";

import React from "react";
import styled from "styled-components";
import FolderIcon from "@/assets/icons/FolderIcon";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

const Container = styled.div`
  display: flex;
  padding: 50px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
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
};

export default function GenericEmptyState({
  title,
  description,
  icon,
}: GenericEmptyStateProps) {
  return (
    <Container>
      {icon || <FolderIconStyled />}
      <ContentText>
        <TitleText>{title}</TitleText>
        {description && <DescriptionText>{description}</DescriptionText>}
      </ContentText>
    </Container>
  );
}
