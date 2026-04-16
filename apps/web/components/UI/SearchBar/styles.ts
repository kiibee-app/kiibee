import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Wrapper = styled.div<{ $width?: string }>`
  width: ${({ $width }) => $width || "100%"};
  max-height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 31.6875rem;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  padding: 15px 16px;
  border-radius: 0.75rem;

  ${media.tablet} {
    flex: 1;
  }
`;

export const LeftIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: ${({ theme }) => theme?.colors.primary.BLACK};

  &::placeholder {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
`;

export const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
`;
