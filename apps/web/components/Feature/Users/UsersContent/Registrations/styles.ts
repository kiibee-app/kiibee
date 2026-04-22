import styled from "styled-components";

export const SectionCard = styled.section`
  margin-top: 24px;
  padding: 20px 16px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};

  ${({ theme }) => theme.media.tablet} {
    margin-top: 16px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  ${({ theme }) => theme.media.tablet} {
    font-size: 15px;
  }
`;

export const SectionDescription = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};

  ${({ theme }) => theme.media.tablet} {
    font-size: 13px;
  }
`;
