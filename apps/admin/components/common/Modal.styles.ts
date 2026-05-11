import styled from "styled-components";

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

export const ModalCard = styled.div`
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};

  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    max-height: calc(100vh - 24px);
    border-radius: 12px;
  }

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    border-radius: 8px;
  }
`;

export const Header = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const Body = styled.div`
  padding: 20px;

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    padding: 16px;
  }
`;

export const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.muted};
  border-radius: 8px;
  min-width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
`;
