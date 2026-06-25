import styled from "styled-components";

export const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 110px 24px 64px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: left;
`;

export const Title = styled.h1`
  margin: 0 0 12px;
  ${({ theme }) => theme.typography.Heading2};
`;

export const Meta = styled.p`
  margin: 0 0 20px;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const Intro = styled.p`
  margin: 0 0 24px;
  ${({ theme }) => theme.typography.Body_Regular};
  white-space: pre-line;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Section = styled.section``;

export const SectionTitle = styled.h2`
  margin: 0 0 8px;
  padding-top: 24px;
  ${({ theme }) => theme.typography.H4_SemiBold};
`;

export const Description = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  white-space: pre-line;
`;

export const ContactCard = styled.section`
  padding: 0;
`;
