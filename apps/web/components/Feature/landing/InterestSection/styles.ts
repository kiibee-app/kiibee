import styled, { css } from "styled-components";

export const Section = styled.section`
  width: 100%;
  min-height: 85vh;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem;
  text-align: center;
`;

export const Title = styled.h2`
  color: #ffffff;
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
    background: #ffffff;
    color: #0b2d1c;
  `,
  light: css`
    background: #cfe8c7;
    color: #0b2d1c;
  `,
  green: css`
    background: #9ec28f;
    color: #0b2d1c;
  `,
  dark: css`
    background: #0b0b0b;
    color: #ffffff;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;
