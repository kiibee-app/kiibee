import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const ProfileGateContainer = styled.div`
  max-width: 500px;
  width: 100%;
  margin: 3rem auto;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${media.mobileMd} {
    padding: 1.5rem;
    margin: 1.5rem auto;
    border-radius: 12px;
  }
`;

export const ProfileGateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0 0 0.5rem;
  text-align: left;
`;

export const ProfileGateDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  margin: 0;
  line-height: 1.5;
`;

export const ProfileGateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ProfileGatePolicyText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  line-height: 1.4;
  margin: 0;
`;

export const ProfileGatePolicyLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.GREEN};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary.GREEN_200};
  }
`;
