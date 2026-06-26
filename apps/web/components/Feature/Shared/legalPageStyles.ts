import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Wrap = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 110px 24px 80px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: left;
  overflow-x: clip;

  a {
    color: ${({ theme }) => theme.colors.primary.BLUE};
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: opacity ${({ theme }) => theme.animations.fast};
    overflow-wrap: anywhere;

    &:hover {
      opacity: 0.8;
    }
  }

  ${media.tablet} {
    padding: 88px 16px 56px;
  }

  ${media.mobileLg} {
    padding: 80px 12px 48px;
  }
`;

export const Header = styled.header`
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 36px;
  padding: 40px 48px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.GREEN_50} 0%,
    ${({ theme }) => theme.colors.primary.PALE_GREEN} 50%,
    ${({ theme }) => theme.colors.neutral.OFF_WHITE} 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN_50};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${media.tablet} {
    padding: 24px 20px;
    border-radius: 16px;
    margin-bottom: 24px;
  }

  ${media.mobileLg} {
    padding: 20px 16px;
    border-radius: 14px;
    margin-bottom: 20px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 10px;
  ${({ theme }) => theme.typography.Heading2};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: break-word;

  ${media.tablet} {
    ${({ theme }) => theme.typography.Heading3};
    line-height: 1.25;
    margin-bottom: 8px;
  }

  ${media.mobileLg} {
    ${({ theme }) => theme.typography.H4_SemiBold};
    line-height: 1.3;
  }
`;

export const Meta = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  word-break: break-word;
  overflow-wrap: break-word;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.GREEN};
    flex-shrink: 0;
  }
`;

export const IntroArea = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  margin-bottom: 32px;
  padding: 24px 28px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.GREEN};
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  overflow-wrap: break-word;
  word-break: break-word;

  ${media.tablet} {
    padding: 18px 16px;
    margin-bottom: 20px;
    border-radius: 12px;
  }

  ${media.mobileLg} {
    padding: 16px 14px;
  }
`;

export const Intro = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  white-space: pre-line;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  min-width: 0;
  counter-reset: section;

  ${media.mobileLg} {
    gap: 12px;
  }
`;

export const Section = styled.section`
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  padding: 28px 32px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
  transition:
    box-shadow ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.GREEN_50};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${media.tablet} {
    padding: 20px 18px;
    border-radius: 14px;
  }

  ${media.mobileLg} {
    padding: 16px 14px;
    border-radius: 12px;
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0 0 12px;
  min-width: 0;
  flex-wrap: wrap;
  ${({ theme }) => theme.typography.H5_Medium};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  line-height: 1.35;
  word-break: break-word;
  overflow-wrap: break-word;
  counter-increment: section;

  &::before {
    content: counter(section);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    margin-top: 1px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.primary.GREEN_100};
    color: ${({ theme }) => theme.colors.primary.WHITE};
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  ${media.tablet} {
    gap: 10px;
    margin-bottom: 10px;

    &::before {
      width: 26px;
      height: 26px;
      font-size: 11px;
    }
  }

  ${media.mobileLg} {
    gap: 8px;

    &::before {
      width: 24px;
      height: 24px;
      font-size: 11px;
    }
  }
`;

export const Description = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  white-space: pre-line;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const FormattedDescription = styled.div`
  margin: 0;
  min-width: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  white-space: pre-line;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  overflow-wrap: break-word;
  word-break: break-word;

  p {
    margin: 0 0 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary.BLUE};
    text-decoration: underline;
    text-underline-offset: 3px;
    overflow-wrap: anywhere;
  }

  ul {
    margin: 10px 0;
    padding-left: 22px;

    ${media.mobileLg} {
      padding-left: 18px;
    }
  }

  li {
    margin: 6px 0;

    &::marker {
      color: ${({ theme }) => theme.colors.primary.GREEN};
    }
  }
`;

export const ContactCard = styled(Section)`
  ${SectionTitle}::before {
    background: ${({ theme }) => theme.colors.primary.GREEN};
  }
`;

export const ContactLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

export const ContactLine = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  word-break: break-word;

  a {
    color: ${({ theme }) => theme.colors.primary.BLUE};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;
