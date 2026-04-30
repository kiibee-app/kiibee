import { MODAL_ALIGN, ModalAlign } from "@/utils/ui";
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

export const ModalContainer = styled.div<{
  $width?: string;
  $height?: string;
  $padding?: string;
  $borderRadius?: string;
  $align?: ModalAlign;
}>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width || "480px"};
  min-height: ${({ $height }) => $height || "auto"};
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: ${({ $borderRadius }) => $borderRadius || "12px"};
  padding: ${({ $padding, $align }) =>
    $padding || ($align === MODAL_ALIGN.START ? "30px" : "40px 60px")};
  text-align: ${({ $align }) => $align || MODAL_ALIGN.CENTER};
  gap: 20px;

  ${media.tablet} {
    width: 90%;
    padding: ${({ $padding }) => $padding || "32px 24px"};
  }
`;

export const IconWrapper = styled.div<{ $margin?: string }>`
  margin: ${({ $margin }) => $margin || "0 auto 16px"};
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

export const Message = styled.div`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div<{
  $row?: boolean;
  $fullWidthButtons?: boolean;
  $align?: ModalAlign;
}>`
  display: flex;
  flex-direction: ${({ $row }) => ($row ? "row" : "column")};
  gap: 12px;
  justify-content: ${({ $align }) => $align || MODAL_ALIGN.CENTER};
  align-items: center;
  width: ${({ $fullWidthButtons }) => ($fullWidthButtons ? "100%" : "auto")};

  & > button {
    width: ${({ $fullWidthButtons }) => ($fullWidthButtons ? "100%" : "176px")};
    flex: ${({ $fullWidthButtons }) =>
      $fullWidthButtons ? "1 1 0" : "0 0 auto"};
    height: 49px;
  }

  ${media.tablet} {
    & > button {
      width: ${({ $fullWidthButtons }) =>
        $fullWidthButtons ? "100%" : "160px"};
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
