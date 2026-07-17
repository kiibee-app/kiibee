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

export const ButtonGroup = styled.div`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  padding: 6px;
  gap: 8px;
`;

export const ApproveButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  padding: 8px 20px;
  border-radius: 9999px; /* Pill shape */
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const RejectButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.WHITE};
  color: ${({ theme }) => theme.colors.primary.RED};
  border: 1px solid ${({ theme }) => theme.colors.primary.RED};
  padding: 8px 20px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover:not(:disabled) {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.RED} 10%,
      ${({ theme }) => theme.colors.primary.WHITE}
    );
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ContentWrapper = styled.div`
  padding: 24px;
`;
