import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;

  ${({ theme }) => theme.media.tablet} {
    padding: 20px;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 16px;
  }
`;

export const Content = styled.div`
  margin-top: 8px;
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  ${({ theme }) => theme.typography.H4_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
