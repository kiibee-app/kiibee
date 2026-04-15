import styled from "styled-components";

export const Wrap = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 110px 24px 64px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0 0 14px;
  ${({ theme }) => theme.typography.Heading2};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
`;

export const Description = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_Regular};
`;
