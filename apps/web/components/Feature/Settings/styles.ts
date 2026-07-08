import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;

  ${({ theme }) => theme.media.tablet} {
    padding: 20px;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 16px;
  }
`;

export const Content = styled.div`
  margin-top: 8px;
`;

export const Settlement = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 16px;
  overflow-x: auto;
  margin-top: 20px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }

  mask-image: linear-gradient(
    to right,
    black calc(100% - 24px),
    transparent 100%
  );
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.primary.BLACK};
  color: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border: none;
  cursor: pointer;
  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY};
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    border-color: ${({ theme }) => theme.colors.neutral.GRAY_200};
    cursor: not-allowed;
    opacity: 1;
    pointer-events: none;
  }
  ${MonoText} {
    color: inherit;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  color: ${(p) => p.theme.colors.primary.BLACK};
  border: 1px solid ${(p) => p.theme.colors.primary.GRAY};
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  ${({ theme }) => theme.typography.H4_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
