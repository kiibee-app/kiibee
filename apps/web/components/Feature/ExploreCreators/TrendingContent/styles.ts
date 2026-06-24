import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.25rem;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const LoadMoreButton = styled(GenericButton)`
  width: 160px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.neutral.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_700};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }
`;
