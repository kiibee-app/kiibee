import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const GlobalSearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.neutral.GRAY_300};
  z-index: 300;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SearchDropdownSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SearchDropdownTitle = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  padding: 0 16px 8px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  margin-bottom: 8px;
`;

export const SearchDropdownItem = styled.div<{ $interactive?: boolean }>`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  cursor: ${({ $interactive = true }) =>
    $interactive ? "pointer" : "default"};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $interactive = true }) =>
      $interactive ? theme.colors.neutral.OFF_WHITE : "transparent"};
  }
`;

export const SearchEmptyText = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
