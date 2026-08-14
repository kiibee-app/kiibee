import styled from "styled-components";
import {
  DEFAULT_MODAL_SIZE,
  MODAL_WIDTH_BY_SIZE,
  type ModalSize,
} from "../../utils/constants";

export type { ModalSize };

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.neutral.OVERLAY};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const ModalCard = styled.div<{ $size?: ModalSize }>`
  width: min(
    ${({ $size = DEFAULT_MODAL_SIZE }) => MODAL_WIDTH_BY_SIZE[$size]},
    100%
  );
  max-height: calc(100vh - 48px);
  overflow-x: hidden;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    max-height: calc(100vh - 24px);
    border-radius: 12px;
  }

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    border-radius: 8px;
  }
`;

export const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const Body = styled.div`
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    padding: 16px;
  }
`;

export const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.muted};
  border-radius: 8px;
  min-width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;
