import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.gredint.VIGNETTE_OUTER};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  padding: 40px 60px;
  text-align: center;
  gap: 20px;

  ${media.tablet} {
    width: 90%;
    padding: 32px 24px;
  }
`;

export const IconWrapper = styled.div`
  margin: 0 auto 16px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 8px;
`;

export const Message = styled.p`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div<{
  $row?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $row }) => ($row ? "row" : "column")};
  gap: 12px;
  justify-content: center;
  align-items: center;

  & > button {
    width: 176px;
    height: 49px;
  }

  ${media.tablet} {
    & > button {
      width: 160px;
      height: 30px;
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
