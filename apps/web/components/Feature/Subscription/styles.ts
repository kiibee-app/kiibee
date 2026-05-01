"use client";

import type React from "react";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { media } from "@repo/ui/breakpoints";

export const SubscriptionShell = styled.section`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing(3)} 0
    ${({ theme }) => theme.spacing(8)};
  background: radial-gradient(
    circle at top,
    ${({ theme }) => theme.colors.primary.GRAY} 0%,
    ${({ theme }) => theme.colors.neutral.WHITE} 34%
  );
`;

export const SubscriptionPageInner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(5)}
    ${({ theme }) => theme.spacing(8)};
`;

export const BackRow = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const BackActionButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  line-height: 0;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 649px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(8)};
  padding-top: ${({ theme }) => theme.spacing(8)};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Title = styled(MonoText).attrs({
  $use: "H4_Medium",
  as: "h1",
})`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  max-width: 420px;
`;

export const PlanList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
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

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const PlanSelectRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(7.5)};
`;

export const FieldGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  ${media.desktop} {
    gap: ${({ theme }) => theme.spacing(3)};
  }
`;

export const TwoColumnRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const ContinueButton = styled(GenericButton)`
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  align-self: center;
  width: 312px;
  margin-top: 20px;
  border: none;

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    color: ${({ theme }) => theme.colors.primary.WHITE};
  }
`;

export const FullWidthContinueButton = styled(GenericButton)`
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radius.lg};

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    color: ${({ theme }) => theme.colors.primary.WHITE};
  }
`;

export const StyledInputField = styled(InputField)`
  & label {
    margin-top: 0;
  }
`;
