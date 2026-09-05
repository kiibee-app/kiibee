import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";
import { layoutAlignCss } from "@/components/Feature/ProfileLayout/Hero/styles";

export const Container = styled.footer`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-top: 1px solid ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Inner = styled.div`
  ${layoutAlignCss}
  margin-top: 35px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 98px;

  ${media.desktop} {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  ${media.mobileXl} {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  ${media.mobileLg} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
    min-height: unset;
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

  ${media.mobileXl} {
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

export const JoinButton = styled(GenericButton)`
  display: flex;
  height: 45px;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
`;
