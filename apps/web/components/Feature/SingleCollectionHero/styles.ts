import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";

export const HeroWrapper = styled.div`
  width: 100%;
  max-width: var(--navbar-inner-max-width, 1440px);
  margin: 0 auto;
  padding: 110px 1.5rem 0;

  ${media.tablet} {
    padding: 88px 1.5rem 0;
  }

  @media (max-width: 640px) {
    padding: 84px 1rem 0;
  }
`;

export const HeroContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 25px;

  ${media.tablet} {
    gap: 18px;
  }
`;

export const ActionButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.MD,
})`
  width: fit-content;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;

  &:hover {
    opacity: 0.85;
  }

  ${media.tablet} {
    padding: 9px 16px;
  }
`;

export const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  justify-content: space-between;
  gap: 12px;

  ${media.tablet} {
    padding-bottom: 16px;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

export const BackButtonWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  width: 100%;

  ${media.tablet} {
    flex-direction: column;
    gap: 24px;
  }
`;

export const HeroImage = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  min-width: 500px;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  max-height: 350px;

  ${media.tablet} {
    min-width: 100%;
    max-height: 280px;
  }
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${media.tablet} {
    gap: 6px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    align-items: stretch;
  }
`;

export const Section = styled.div`
  width: 100%;
  max-width: var(--navbar-inner-max-width, 1440px);
  margin: 0 auto;
  padding: 0 1.5rem;

  ${media.tablet} {
    padding: 0 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

export const ShowcaseWrapper = styled.div`
  margin-bottom: 60px;
`;

export const EmbeddedSection = styled(Section)`
  max-width: none;
  margin: 0;
  padding: 0;
`;

export const EmbeddedHeader = styled(Header)`
  margin: 28px 0 20px;
  align-items: center;
`;

export const EmbeddedShowcaseWrapper = styled(ShowcaseWrapper)`
  margin-bottom: 32px;
`;

export const ResultsState = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors?.neutral?.GRAY_500};
`;
