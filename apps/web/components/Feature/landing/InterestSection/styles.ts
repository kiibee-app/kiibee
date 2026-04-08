import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const Section = styled.section`
  width: 100%;
  min-height: 80vh;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
  text-align: center;

  ${media.tablet} {
    min-height: auto;
  }
`;

export const Title = styled.h2`
  margin-bottom: 3.5rem;

  ${media.tablet} {
    margin-bottom: 2.5rem;
    max-width: 100%;
  }
`;

export const PillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 850px;

  ${media.tablet} {
    gap: 0.75rem;
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
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  ${({ $variant }) => variants[$variant]};

  ${media.tablet} {
    padding: 0.7rem 1.3rem;
    font-size: 0.9rem;
  }
`;
