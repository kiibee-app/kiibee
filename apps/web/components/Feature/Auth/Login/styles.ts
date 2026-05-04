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
  max-width: 560px;
  background: ${({ theme }) => theme.colors.gredint.DEEP_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 180px 55px 90px;
  border-radius: 0 0 0 0;
  position: relative;

  ${media.tablet} {
    width: 100%;
    max-width: 100%;
    flex: 0 0 auto;
    padding: 2.5rem 1.5rem;
  }
`;
