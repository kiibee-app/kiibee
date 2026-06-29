"use client";

import React from "react";
import {
  Container,
  ContentText,
  TitleText,
  DescriptionText,
  FolderIconStyled,
} from "./styles";

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
