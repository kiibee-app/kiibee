import { MonoText } from "@/components/UI/Monotext";
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 24px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 25px;
  margin: 16px 0;
  padding-top: 10px;
  align-items: center;
`;

export const TabButton = styled.div<{
  $active?: boolean;
  $isIcon?: boolean;
}>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY};
  border-bottom: ${({ $active, $isIcon }) =>
    !$isIcon && $active ? "2px solid black" : "2px solid transparent"};

  ${MonoText} {
    color: inherit;
  }
`;

export const SearchWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
`;

export const Content = styled.div`
  margin-top: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.primary.BLACK};
  color: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  ${MonoText} {
    color: inherit;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  color: ${(p) => p.theme.colors.primary.BLACK};
  border: 1px solid ${(p) => p.theme.colors.primary.GRAY};
`;
