import styled from "styled-components";
import FolderIcon from "@/assets/icons/FolderIcon";
import { MonoText } from "@/components/UI/Monotext";

export const Container = styled.div<{ $bg?: string; $border?: string }>`
  display: flex;
  padding: 50px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  background: ${({ theme, $bg }) => {
    if (!$bg) return theme.colors.neutral.OFF_WHITE;
    const neutral = theme.colors.neutral as Record<string, string>;
    const key = $bg.toUpperCase();
    return neutral[key] || $bg;
  }};
  border: ${({ theme, $border }) => {
    if (!$border) return "none";
    const neutral = theme.colors.neutral as Record<string, string>;
    const key = $border.toUpperCase();
    if (neutral[key]) {
      return `1px solid ${neutral[key]}`;
    }
    return $border;
  }};
`;

export const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 640px;
  gap: 8px;
`;

export const TitleText = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const DescriptionText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
`;

export const FolderIconStyled = styled(FolderIcon).attrs(({ theme }) => ({
  width: 54,
  height: 42,
  color: theme.colors.neutral.GRAY_400,
}))``;
