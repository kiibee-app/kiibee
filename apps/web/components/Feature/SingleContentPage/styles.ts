import { media } from "@repo/ui/breakpoints";
import styled, { css } from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";

export const Wrapper = styled.section`
  width: 100%;
  max-width: 1300px;
  min-height: 100vh;
  height: auto;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 7rem 1.5rem 4rem;

  ${media.tablet} {
    padding: 6rem 1rem 3rem;
  }
`;

export const Card = styled.article`
  width: 100%;
  margin: 0;

  ${media.tablet} {
    margin-top: 0.5rem;
  }
`;

export const ContentLayout = styled.div<{ $isPdf?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isPdf }) =>
    $isPdf ? "minmax(0, 0.5fr) minmax(0, 0.95fr)" : "1fr"};
  gap: ${({ $isPdf }) => ($isPdf ? "2rem" : "0")};
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: ${({ $isPdf }) => ($isPdf ? "1.5rem" : "0")};
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1.75rem;
`;

export const BackButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 34px;
  padding: 5px 20px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
`;

export const ShareText = styled.span`
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const Hero = styled.div<{ $isPdf?: boolean }>`
  position: relative;
  width: ${({ $isPdf }) => ($isPdf ? "376px" : "min(100%, 900px)")};
  height: ${({ $isPdf }) => ($isPdf ? "530px" : "auto")};
  aspect-ratio: ${({ $isPdf }) => ($isPdf ? undefined : "90 / 49")};
  margin: 0 auto ${({ $isPdf }) => ($isPdf ? "0" : "2.25rem")};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${media.tablet} {
    width: 100%;
    height: auto;
    aspect-ratio: 376 / 530;
  }
`;

export const Preview = styled.div`
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PreviewVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PreviewAudio = styled.audio`
  width: min(760px, calc(100% - 48px));
  position: absolute;
  left: 50%;
  bottom: 40%;
  transform: translateX(-50%);
`;

export const PreviewDocument = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeroTag = styled.span`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 2;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeroTagText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const HeroMediaTag = styled.span`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${media.tablet} {
    left: 1rem;
    bottom: 1rem;
  }
`;

export const HeroMediaText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const TrailerButton = styled.button`
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0.65rem 1rem;
  cursor: pointer;

  ${media.tablet} {
    right: 1rem;
    bottom: 1rem;
  }
`;

export const TrailerText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const ContentShell = styled.div<{ $isPdf?: boolean }>`
  width: 100%;
  align-self: start;
`;

export const CreatorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.8rem;
`;

export const CreatorAvatar = styled.span`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  img {
    object-fit: cover;
  }
`;

export const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const HeadingBlock = styled.div`
  margin-bottom: 1.8rem;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-transform: capitalize;
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const MainTitle = styled.h1`
  ${({ theme }) => theme.typography.Heading2};
  margin: 0;
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const BodyTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1rem;
`;

export const DescriptionText = styled.p`
  ${({ theme }) => theme.typography.Body_Medium};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.8rem;
`;

export const InfoTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 8px 16px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const InfoTagText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const MainAction = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: "lg",
})`
  border-radius: 12px;
  min-height: 51px;
  padding: 10px 20px;
  margin-bottom: 1.5rem;
`;

export const PricingCtaRow = styled.div`
  display: inline-flex;
  align-items: stretch;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  max-width: 100%;

  > button {
    flex: 0 0 auto;
    width: auto;
    min-width: 160px;
    min-height: 52px;
    border-radius: 12px;
    white-space: normal;
  }

  .pricing-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    text-align: center;
  }
`;

export const PricingCtaContent = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  line-height: 1.1;
  text-align: center;
`;

export const PricingCtaSubtext = styled.span`
  ${({ theme }) => theme.typography.Body_Medium}
  font-size: 12px;
`;

export const MainActionText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const ExpiryText = styled.p<{ $tone?: "default" | "urgent" }>`
  ${({ theme }) => theme.typography.Body_Medium};
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  ${({ $tone, theme }) =>
    $tone === "urgent" &&
    css`
      color: ${theme.colors.primary.RED};
    `}
`;

export const MetaSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  padding-top: 1.5rem;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MetaKey = styled.span`
  min-width: 100px;
`;

export const MetaLabelText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const MetaValueText = styled.span<{ $strong?: boolean }>`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme, $strong }) =>
    $strong ? theme.typography.Body_Bold : theme.typography.Body_Medium}
`;

export const PreviewOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.primary.BLACK_90};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

export const PreviewModalContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: 1200px;
  height: 85vh;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  overflow: hidden;
`;

export const PreviewCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.gradient.CARD_SHADOW};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  }
`;

export const PreviewContent = styled.div`
  width: 100%;
  height: 100%;
  border: 0;

  iframe& {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;
