"use client";

import styled from "styled-components";

export const ErrorPage = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const ErrorCard = styled.section`
  width: 100%;
  max-width: 760px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 24px;
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.primary.RED};
  color: ${({ theme }) => theme.colors.primary.RED};
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 6px 10px;
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 700;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 14px 0 0;
  ${({ theme }) => theme.typography.Heading2};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Description = styled.p`
  margin: 10px 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  line-height: 1.55;
`;

export const MessageBox = styled.div`
  margin-top: 18px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary.ORANGE};
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 600;
`;

export const ConsoleLabel = styled.h2`
  margin: 18px 0 0;
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ConsoleBlock = styled.pre`
  margin-top: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gradient.NEAR_BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_700};
  padding: 14px;
  overflow-x: auto;
  ${({ theme }) => theme.typography.Body_Medium};
  line-height: 1.55;
`;

export const RetryButton = styled.button`
  margin-top: 18px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 11px 16px;
  cursor: pointer;
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 700;

  &:hover {
    opacity: 0.9;
  }
`;
