"use client";

import styled from "styled-components";
import Link from "next/link";

export const NotFoundMain = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing(6)};
  background:
    radial-gradient(
      circle at 12% 15%,
      ${({ theme }) => theme.colors.primary.GREEN_10} 0%,
      transparent 38%
    ),
    radial-gradient(
      circle at 88% 82%,
      ${({ theme }) => theme.colors.primary.WHITE_18} 0%,
      transparent 32%
    ),
    ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const NotFoundCard = styled.section`
  width: 100%;
  max-width: 46rem;
  padding: ${({ theme }) => theme.spacing(8)};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
`;

export const ErrorBadge = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  color: ${({ theme }) => theme.colors.secondary.main};
  font: ${({ theme }) => theme.typography.Body_Small};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Heading = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.secondary.main};
  font: ${({ theme }) => theme.typography.Heading2};
`;

export const Description = styled.p`
  max-width: 34rem;
  margin: 0 auto ${({ theme }) => theme.spacing(6)};
  color: ${({ theme }) => theme.colors.secondary.muted};
  font: ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.65;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(6)}`};
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font: ${({ theme }) => theme.typography.Body_SemiBold};
  text-decoration: none;
  transition:
    transform ${({ theme }) => theme.animations.fast},
    opacity ${({ theme }) => theme.animations.fast};

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;
