import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { HexRow } from "./styles";

export const PopoverContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
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

export const StyledHexRow = styled(HexRow)`
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: 6px;
  padding: 8px 12px;
`;
