import styled, { css } from "styled-components";

export const Section = styled.section`
  width: 100%;
  min-height: 85vh;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 119px 370px 119px 369px;
  text-align: center;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 600;
  margin-bottom: 3.5rem;
  max-width: 55rem;
  line-height: 1.15;
`;

export const PillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 1000px;
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

export const Pill = styled.span<{ variant: keyof typeof variants }>`
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  ${({ variant }) => variants[variant]};
`;
