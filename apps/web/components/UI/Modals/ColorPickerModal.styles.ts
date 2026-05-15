import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const PopoverContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 377px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.neutral.GRAY_300};
  z-index: 1000;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.mobile} {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 340px;
  }
`;

export const PopoverFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 12px;

  & > button {
    flex: 1;
  }
`;

export const HexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: 6px;
  padding: 8px 12px;
`;

export const PickerChrome = styled.div`
  width: 100%;
  margin-inline: auto;

  .react-colorful {
    width: 100%;
    gap: 12px;
  }

  .react-colorful__saturation {
    border-radius: 8px;
  }

  .react-colorful__hue {
    height: 14px;
    border-radius: 999px;
  }

  .react-colorful__pointer {
    width: 22px;
    height: 22px;
    border: 2px solid ${({ theme }) => theme.colors.primary.WHITE};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.neutral.GRAY_300};
  }
`;

export const PreviewSwatch = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 48px;
  height: 32px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.neutral.GRAY_250};
`;
