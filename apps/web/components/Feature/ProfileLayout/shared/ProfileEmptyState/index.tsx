"use client";

import React from "react";
import FolderIcon from "@/assets/icons/FolderIcon";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { EmptyStateWrapper, IconContainer } from "./styles";

type ProfileEmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function ProfileEmptyState({
  title,
  description,
  icon,
}: ProfileEmptyStateProps) {
  return (
    <EmptyStateWrapper>
      <IconContainer>
        {icon || (
          <FolderIcon width={28} height={28} color={COLORS.neutral.GRAY_400} />
        )}
      </IconContainer>
      <MonoText
        $use="H4_SemiBold"
        color={COLORS.primary.BLACK}
        style={{ marginBottom: "8px" }}
      >
        {title}
      </MonoText>
      <MonoText
        $use="Body_Regular"
        color={COLORS.neutral.GRAY_500}
        style={{ maxWidth: "420px" }}
      >
        {description}
      </MonoText>
    </EmptyStateWrapper>
  );
}
