import styled from "styled-components";

export const EmptyStateBox = styled.div`
  margin-top: 16px;
  padding: 48px 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 160px;

  ${({ theme }) => theme.media.tablet} {
    padding: 40px 20px;
    min-height: 140px;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 32px 16px;
    min-height: 120px;
  }
`;

export const EmptyStateTitle = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
`;

export const EmptyStateDescription = styled.p`
  margin: 8px 0 0 0;
  max-width: 520px;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;
