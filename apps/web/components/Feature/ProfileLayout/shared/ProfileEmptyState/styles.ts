import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, 1300px);
  margin: 40px auto;
  padding: 80px 32px;
  border-radius: 16px;
  border: 1px dashed ${({ theme }) => theme.colors.neutral.GRAY_300};
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  text-align: center;
  box-sizing: border-box;
  min-height: 320px;

  ${media.tablet} {
    padding: 60px 24px;
    min-height: 280px;
  }

  ${media.mobileLg} {
    margin: 20px auto;
    padding: 40px 16px;
    min-height: 220px;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  box-shadow: 0 8px 24px
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.BLACK} 6%,
      transparent
    );
`;
