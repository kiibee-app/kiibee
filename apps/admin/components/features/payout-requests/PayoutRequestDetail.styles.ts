import styled from "styled-components";

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.GREEN};
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

export const ApproveButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ContentWrapper = styled.div`
  padding: 24px;
`;
