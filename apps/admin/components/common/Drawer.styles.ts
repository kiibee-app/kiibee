import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.neutral.OVERLAY};
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  z-index: 1200;
  animation: ${fadeIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DrawerCard = styled.div`
  width: min(500px, 100vw);
  height: 100dvh;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.secondary.border};
  animation: ${slideIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.secondary.main};
  letter-spacing: -0.01em;
`;

export const Body = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.muted};
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
    color: ${({ theme }) => theme.colors.secondary.main};
    border-color: ${({ theme }) => theme.colors.neutral.GRAY_200};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;
