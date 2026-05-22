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

  &:hover svg path {
    fill: ${({ $danger, theme }) =>
      $danger ? theme.colors.primary.RED : "currentColor"};
    fill-opacity: ${({ $danger }) => ($danger ? 1 : 0.6)};
  }
`;

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  text-align: left;
`;
