import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 24px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin: 16px 0;
  padding-top: 10px;
  align-items: center;
`;

export const TabButton = styled.button<{
  $active?: boolean;
  $isIcon?: boolean;
}>`
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
  transition: all 0.2s ease;
`;
