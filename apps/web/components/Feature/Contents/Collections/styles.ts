import styled from "styled-components";

export const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const IconButton = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover svg {
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.primary.RED : "inherit"};
  }
`;
