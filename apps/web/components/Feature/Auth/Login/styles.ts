import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const PageLayout = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  gap: 0;

  ${media.tablet} {
    flex-direction: column;
  }
  ${media.desktop} {
    align-items: stretch;
  }
`;

export const FormPanel = styled.section`
  flex: 6;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;

  ${media.tablet} {
    padding: 2rem 1rem;
  }
  ${media.desktop} {
    flex: 5;
    padding: 2.25rem 1.25rem;
  }
`;

export const SlidePanel = styled.section`
  flex: 0 0 520px;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.gredint.DEEP_GREEN};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 241px 85.178px 96.491px 85px;
  border-radius: 0 0 0 0;
  position: relative;

  ${media.tablet} {
    width: 100%;
    flex: 0 0 auto;
    padding: 2.5rem 1.5rem;
  }
  ${media.desktop} {
    flex: 0 0 360px;
    max-width: 360px;
    padding: 180px 55px 90px;
    justify-content: center;
  }
`;
