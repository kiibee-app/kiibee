"use client";

import type React from "react";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";

export const SubscriptionShell = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(5)};
  background: radial-gradient(
    circle at top,
    ${({ theme }) => theme.colors.primary.GRAY} 0%,
    ${({ theme }) => theme.colors.neutral.WHITE} 34%
  );
`;

export const SubscriptionCard = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(5)};
`;

export const Heading = styled(MonoText).attrs({
  $use: "H4_Medium",
  as: "h1",
})`
  margin: 0;
  max-width: 320px;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: center;
`;

export const PlanList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const PlanOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected
        ? theme.colors.primary.GREEN_30
        : theme.colors.neutral.GRAY_200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.GREEN_50 : theme.colors.neutral.GRAY_100};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: ${({ theme, $selected }) =>
    $selected ? theme.shadows.sm : "none"};

  &:hover {
    transform: translateY(-1px);
  }
`;

export const Radio = styled.span<{ $selected?: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: ${({ theme }) => theme.radius.full};
  flex: 0 0 auto;
  border: 2px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_300};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.BLACK : theme.colors.primary.WHITE};
  box-shadow: inset 0 0 0 2px
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary.WHITE : "transparent"};
`;

export const PlanInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const PlanNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const PlanName = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.BLACK};
`;

export const PlanPrice = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  white-space: nowrap;
`;

export const PlanMeta = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const CompareLink = styled(MonoText).attrs({
  $use: "Body_Small",
  as: "a",
})<React.AnchorHTMLAttributes<HTMLAnchorElement>>`
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-decoration: underline;
  text-underline-offset: 2px;
  margin-top: ${({ theme }) => theme.spacing(0.5)};

  &:hover {
    opacity: 0.8;
  }
`;

export const ContinueButton = styled(GenericButton)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radius.lg};
`;
