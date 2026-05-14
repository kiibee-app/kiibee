import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Container = styled.footer`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-top: 1px solid ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 98px;

  ${media.tablet} {
    padding: 18px 20px;
  }

  ${media.mobileLg} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
    min-height: unset;
    padding: 18px 16px 20px;
  }
`;

export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
`;

export const BrandLogo = styled.div`
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  flex: 0 0 auto;

  img {
    display: block;
    width: auto;
    height: 100%;
  }
`;

export const BrandCopy = styled.div`
  max-width: 480px;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  ${({ theme }) => theme.typography.Body_Medium}

  ${({ theme }) => theme.media.mobileMd} {
    max-width: 100%;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  width: auto;

  ${media.mobileLg} {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const CTA = styled.div`
  display: inline-flex;
  align-items: center;
`;
