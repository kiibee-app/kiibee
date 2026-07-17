import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { Wrapper as SearchBarWrapper } from "@/components/UI/SearchBar/styles";
import { SIZE, VARIANT } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { shimmer } from "@/components/UI/Skeleton/styles";

export const HeroWrapper = styled.div`
  width: 100%;
  max-width: var(--navbar-inner-max-width, 1440px);
  margin: 0 auto;
  padding: 110px 1.5rem 0;

  ${media.tablet} {
    padding: 88px 1.5rem 0;
  }

  ${media.mobileXl} {
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

export const PricingActionButton = styled(GenericButton)`
  width: fit-content;
  padding: 8px 15px;
  border-radius: 12px;
  height: auto;

  &:hover {
    opacity: 0.85;
  }
`;

export const PricingActions = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const PricingButtonContent = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const PricingButtonSubtitle = styled.small`
  font-size: 10px;
  opacity: 0.72;
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

  ${media.mobileXl} {
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
  position: relative;
  width: 33.75rem;
  height: 23.125rem;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 25%,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 50%,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite ease-in-out;

  ${media.tablet} {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
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

export const CreatorRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
`;

export const CreatorAvatar = styled.span`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_SemiMedium}
`;

export const Description = styled(MonoText)`
  max-width: 43.125rem;
  white-space: pre-line;
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

  ${SearchBarWrapper} {
    height: 42px;
    padding: 10px 16px;
  }

  ${media.mobileXl} {
    align-items: stretch;
  }
`;

export const Section = styled.div`
  width: 100%;
  max-width: var(--navbar-inner-max-width, 1440px);
  margin: 0 auto;
  padding: 2.5rem 1.5rem;

  ${media.tablet} {
    padding: 2rem 1.5rem;
  }

  ${media.mobileXl} {
    padding: 1.5rem 1rem;
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

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;
