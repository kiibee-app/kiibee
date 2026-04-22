import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import { MonoText } from "@/components/UI/Monotext";

export const PageShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 110px);
  padding: 12px 30px 30px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Title = styled(MonoText).attrs({
  $use: "H4_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 14px 18px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
`;

export const PlusMark = styled.span`
  font-size: 22px;
  line-height: 1;
  font-weight: 300;
`;

export const TabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  border: 0;
  background: transparent;
  padding: 10px 0;
  cursor: pointer;
  font-family: ${typography.Body_SemiBold.fontFamily};
  font-weight: ${typography.Body_SemiBold.fontWeight};
  line-height: ${typography.Body_SemiBold.lineHeight};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY};

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3px;
    height: 2px;
    border-radius: 999px;
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary.BLACK : theme.colors.gredint.TRANSPARENT};
  }
`;

export const SearchButton = styled.button`
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ContentPanel = styled.div`
  padding-top: 22px;
`;

export const PlaceholderLine = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;
