import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(6)};

  ${({ theme }) => theme.media.tablet} {
    padding: ${({ theme }) => theme.spacing(5)};
  }

  ${({ theme }) => theme.media.mobile} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const Content = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const Settlement = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 16px;
  overflow-x: auto;
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(4)}`};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(6)};
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  align-items: center;
`;

export const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing(2.5)} ${theme.spacing(5)}`};
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
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  ${({ theme }) => theme.typography.H4_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
