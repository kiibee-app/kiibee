import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const Section = styled.section`
  width: 100%;
  min-height: 500px;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
  text-align: center;

  ${media.tablet} {
    min-height: auto;
    padding: 48px 20px;
  }
`;

export const Title = styled.h2`
  margin-bottom: 3.5rem;

  ${media.tablet} {
    margin-bottom: 2.5rem;
    max-width: 100%;

    > * {
      ${({ theme }) => theme.typography.Heading3};
    }
  }
`;

export const PillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 850px;

  ${media.tablet} {
    gap: 0.625rem;
    max-width: 18rem;
  }
`;

const variants = {
  white: css`
    background: ${({ theme }) => theme.colors.primary.WHITE};
    color: ${({ theme }) => theme.colors.primary.BLACK};
  `,
  light: css`
    background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
    color: ${({ theme }) => theme.colors.primary.GREEN_100};
  `,
  green: css`
    background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
    color: ${({ theme }) => theme.colors.primary.WHITE};
  `,
  dark: css`
    background: ${({ theme }) => theme.colors.primary.BLACK};
    color: ${({ theme }) => theme.colors.primary.WHITE};
  `,
};

export const Pill = styled(MonoText)<{
  $variant: keyof typeof variants;
}>`
  ${({ theme }) => theme.typography.Body_Medium};
  display: inline-block;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  white-space: nowrap;
  cursor: default;
  user-select: none;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease;

  ${({ $variant }) => variants[$variant]};

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
    }
  }

  ${media.tablet} {
    ${({ theme }) => theme.typography.Body_Regular};
    padding: 0.7rem 1.1rem;
  }
`;
