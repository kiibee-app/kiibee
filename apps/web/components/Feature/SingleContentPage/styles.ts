import { media } from "@repo/ui/breakpoints";
import styled, { css } from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { pulse } from "@/utils/animations";
import { CURSOR, VARIANT } from "@/utils/Constants";

export const Wrapper = styled.section<{ $embedded?: boolean }>`
  width: 100%;
  max-width: ${({ $embedded }) => ($embedded ? "none" : "1300px")};
  min-height: ${({ $embedded }) => ($embedded ? "0" : "100vh")};
  height: auto;
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${({ $embedded }) => ($embedded ? "0" : "7rem 1.5rem 4rem")};

  ${media.tablet} {
    padding: ${({ $embedded }) => ($embedded ? "0" : "6rem 1rem 3rem")};
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

  ${media.desktopSm} {
    grid-template-columns: 1fr;
    gap: ${({ $isPdf }) => ($isPdf ? "1.5rem" : "0")};
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: ${({ $isPdf }) => ($isPdf ? "1.5rem" : "0")};
  }
`;

export const TopBar = styled.div<{ $embedded?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ $embedded }) => ($embedded ? "1rem" : "1.75rem")};
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

export const Hero = styled.div<{
  $isPdf?: boolean;
  $isLoading?: boolean;
}>`
  position: ${({ $isPdf }) => ($isPdf ? "sticky" : "relative")};
  top: ${({ $isPdf }) => ($isPdf ? "6rem" : "auto")};
  z-index: 2;
  width: ${({ $isPdf }) => ($isPdf ? "100%" : "min(100%, 900px)")};
  max-width: ${({ $isPdf }) => ($isPdf ? "376px" : "none")};
  height: auto;
  aspect-ratio: ${({ $isPdf }) => ($isPdf ? "376 / 530" : "90 / 49")};
  margin: 0 auto ${({ $isPdf }) => ($isPdf ? "0" : "2.25rem")};
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_200};

  @supports not (aspect-ratio: 1 / 1) {
    padding-bottom: ${({ $isPdf }) => ($isPdf ? "140.96%" : "54.44%")};
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}

  ${media.desktopSm} {
    position: relative;
    top: auto;
    max-width: none;
    margin: 0 auto ${({ $isPdf }) => ($isPdf ? "1.5rem" : "2.25rem")};
  }

  ${media.tablet} {
    position: relative;
    top: auto;
    width: 100%;
    max-width: none;
    height: auto;
    aspect-ratio: ${({ $isPdf }) => ($isPdf ? "376 / 530" : "90 / 49")};
  }
`;

export const HeroBlurBg = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(7px) brightness(0.6) saturate(1.2);
  transform: scale(1.1);
  z-index: 0;
  pointer-events: none;
  user-select: none;
`;

export const Preview = styled.div<{ $clickable?: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  color: ${({ theme }) => theme.colors.primary.BLACK};

  ${media.tablet} {
    left: 1rem;
    bottom: 1rem;
  }
`;

export const HeroMediaText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const TrailerButton = styled.button<{ $noTrailer?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0.65rem 1rem;
  cursor: ${({ $noTrailer }) => ($noTrailer ? CURSOR.DEFAULT : CURSOR.POINTER)};
`;

export const TrailerText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const TrailerWrapper = styled.div<{ $noTrailer?: boolean }>`
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 2;

  ${media.tablet} {
    right: 1rem;
    bottom: 1rem;
  }
`;

export const NoTrailerTooltip = styled.span`
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.5rem);
  z-index: 3;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;

  ${TrailerWrapper}:hover & {
    opacity: 1;
  }
`;

export const CenteredPlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px ${({ theme }) => theme.colors.neutral.GRAY_400};
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  svg {
    margin-left: 4px;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

export const ContentShell = styled.div<{ $isPdf?: boolean }>`
  width: 100%;
  align-self: start;
  min-width: 0;
`;

export const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const CreatorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  margin-bottom: 1rem;
  text-decoration: none;

  &:hover ${CreatorName} {
    text-decoration: underline;
  }
`;

export const CreatorAvatar = styled.span`
  position: relative;
  width: 1.875rem;
  height: 1.875rem;
  flex: 0 0 30px;
  border-radius: 6px;
  overflow: hidden;
  background: transparent;

  img {
    object-fit: contain;
  }
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
  word-break: break-word;
  overflow-wrap: break-word;
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
  word-break: break-word;
  overflow-wrap: break-word;
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

export const MainActionRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-width: 100%;

  ${MainAction} {
    margin-bottom: 0;
  }
`;

export const MainActionExpiryText = styled.p`
  ${({ theme }) => theme.typography.Body_Medium};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.RED};
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

export const PricingCtaSubtext = styled.span<{ $isPrimary?: boolean }>`
  ${({ theme }) => theme.typography.Body_Medium}
  font-size: 12px;
  color: ${({ theme, $isPrimary }) =>
    $isPrimary ? theme.colors.primary.WHITE_90 : theme.colors.neutral.GRAY_500};
  transition: color 120ms ease;

  .pricing-cta:hover & {
    color: ${({ theme, $isPrimary }) =>
      $isPrimary ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_500};
  }
`;

export const MainActionText = styled.span`
  color: inherit;
  ${({ theme }) => theme.typography.Body_Medium}
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
  align-items: flex-start;
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
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  flex: 1;

  a {
    color: ${({ theme }) => theme.colors.primary.BLUE};
    text-decoration: underline;
    word-break: break-all;
    &:hover {
      opacity: 0.8;
    }
  }
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
  max-width: 900px;
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

export const AudioPlayerRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.colors.gradient.CANVAS_BG} 0%,
    ${({ theme }) => theme.colors.primary.GREEN_100} 48%,
    ${({ theme }) => theme.colors.neutral.DUSTY_TEAL} 100%
  );
`;

export const AudioBlurBg = styled.div`
  position: absolute;
  inset: -20%;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.45) saturate(1.15);
  transform: scale(1.15);
  pointer-events: none;
`;

export const AudioPlayerBody = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  width: min(420px, calc(100% - 3rem));
  padding: 2rem 0;

  ${media.tablet} {
    gap: 1.25rem;
    width: min(320px, calc(100% - 2rem));
  }
`;

export const AudioArtwork = styled.div<{ $playing?: boolean }>`
  position: relative;
  width: min(280px, 55vw);
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 18px 48px ${({ theme }) => theme.colors.gradient.CARD_SHADOW};
  transition: transform 0.35s ease;

  ${({ $playing }) =>
    $playing &&
    css`
      transform: scale(1.02);
    `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const AudioArtworkFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary.WHITE_10};
`;

export const AudioBars = styled.div`
  position: absolute;
  inset: auto 0 1rem 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  height: 2rem;
  pointer-events: none;
`;

export const AudioBar = styled.span<{ $delay?: number }>`
  width: 5px;
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  opacity: 0.9;
  transform-origin: bottom;
  animation: audioBarPulse 0.9s ease-in-out infinite;
  animation-delay: ${({ $delay = 0 }) => `${$delay}s`};

  @keyframes audioBarPulse {
    0%,
    100% {
      transform: scaleY(0.35);
    }
    50% {
      transform: scaleY(1);
    }
  }
`;

export const AudioMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
  width: 100%;
`;

export const AudioLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary.WHITE_80};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const AudioTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  ${({ theme }) => theme.typography.Heading3};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
export const AudioPlayButton = styled.button<{ $playing?: boolean }>`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px ${({ theme }) => theme.colors.gradient.CARD_SHADOW};
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  svg {
    margin-left: ${({ $playing }) => ($playing ? "0" : "3px")};
  }

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.96);
  }
`;
export const AudioControls = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

export const AudioTime = styled.span`
  color: ${({ theme }) => theme.colors.primary.WHITE_80};
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  min-width: 2.5rem;
`;

export const AudioProgressTrack = styled.div`
  position: relative;
  height: 28px;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 6px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.primary.WHITE_18};
  }
`;

export const AudioProgressFill = styled.div`
  position: absolute;
  left: 0;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary.GREEN};
  pointer-events: none;
  z-index: 1;
`;

export const AudioProgressInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  appearance: none;
  z-index: 2;
`;

export const PurchaseModalCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: 12px;
  margin: 0 1.5rem;
  overflow: hidden;
`;

export const PurchaseModalCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
`;

export const PurchaseModalCardHeaderLabel = styled.span`
  ${({ theme }) => theme.typography.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalCardHeaderExpiry = styled.span`
  ${({ theme }) => theme.typography.Body_Medium}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalCardBody = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem 1rem;
`;

export const PurchaseModalRentalCardBody = styled(PurchaseModalCardBody)`
  padding-top: 0;
`;

export const PurchaseModalCardImage = styled.div`
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  img {
    object-fit: cover;
  }
`;

export const PurchaseModalCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const PurchaseModalCardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  width: fit-content;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalCardTitle = styled.div`
  ${({ theme }) => theme.typography.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const PurchaseModalCardCreator = styled.div`
  ${({ theme }) => theme.typography.Body_Medium}
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const PurchaseModalCardPrice = styled.div`
  ${({ theme }) => theme.typography.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalHeading = styled.div`
  padding: 2rem 1.875rem 0.875rem;
`;

export const PurchaseModalCollectionCard = styled(PurchaseModalCard)`
  margin: 0 1.875rem;
  border-radius: 8px;
`;

export const PurchaseModalCollectionCardBody = styled(PurchaseModalCardBody)`
  padding: 1.25rem;
`;

export const PurchaseModalCollectionRentalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem 0;
`;

export const PurchaseModalCollectionRentalPeriod = styled.div`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_SemiMedium}
`;

export const PurchaseModalCollectionRentalExpires = styled.div`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: right;
  ${({ theme }) => theme.typography.Body_SemiMedium}
`;

export const PurchaseModalCollectionRentalCardBody = styled(
  PurchaseModalCollectionCardBody,
)`
  padding-top: 0.75rem;
`;

export const PurchaseModalCollectionCardImage = styled(PurchaseModalCardImage)`
  height: 90px;
`;

export const PurchaseModalCollectionCardBadge = styled(PurchaseModalCardBadge)`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 1;
`;

export const PurchaseModalCollectionCardInfo = styled(PurchaseModalCardInfo)`
  flex: 1;
  justify-content: center;
`;

export const PurchaseModalCollectionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: 5px;
`;

export const PurchaseModalCollectionBenefits = styled.section`
  padding: 1rem 1.5rem 0.5rem;
`;

export const PurchaseModalCollectionBenefitsTitle = styled.div`
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const PurchaseModalCollectionBenefitsList = styled.ul`
  display: grid;
  gap: 0.375rem;
  margin: 0;
  padding-left: 1.25rem;
`;

export const PurchaseModalCollectionBenefitsItem = styled.li`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalRentalInfo = styled.div`
  padding: 1.25rem 1.5rem;
`;

export const PurchaseModalRentalTitle = styled.div`
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalRentalList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
`;

export const PurchaseModalRentalItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PurchaseModalPaymentMethod = styled.div`
  padding: 0.5rem 1.5rem 0.75rem;
`;

export const PurchaseModalPaymentMethodTitle = styled.div`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalPaymentMethodList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

export const PurchaseModalPaymentMethodOption = styled.button<{
  $selected?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 56px;
  padding: 0.625rem 1rem;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: left;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;

export const PurchaseModalPaymentMethodText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PurchaseModalPaymentMethodSelected = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const PurchaseModalPaymentMethodPrimary = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PurchaseModalPaymentMethodDefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  ${({ theme }) => theme.typography.Body_Small}
  white-space: nowrap;
`;

export const PurchaseModalPaymentMethodHint = styled.span`
  display: block;
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const PurchaseModalDiscountSection = styled.div`
  padding: 0 1.5rem 1.25rem;
`;

export const PurchaseModalDiscountLabel = styled.div`
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalDiscountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PurchaseModalDiscountInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Medium}
  color: ${({ theme }) => theme.colors.primary.BLACK};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;

export const PurchaseModalCouponError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.primary.RED} 10%, transparent)`};
  color: ${({ theme }) => theme.colors.primary.RED};

  svg {
    flex-shrink: 0;
  }
`;

export const PurchaseModalCouponValidityNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.primary.ORANGE} 12%, transparent)`};
  color: ${({ theme }) => theme.colors.primary.ORANGE};

  svg {
    flex-shrink: 0;
  }
`;

export const PurchaseModalPriceSummary = styled.div`
  padding: 0 1.5rem 1.25rem;
`;

export const PurchaseModalPriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const PurchaseModalPriceRowTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const PurchaseModalPriceLabel = styled.span`
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const PurchaseModalPriceValue = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalButtonWrapper = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

export const PurchaseModalCardVisual = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 1.5rem 0;

  svg {
    width: 100%;
    max-width: 320px;
    height: auto;
  }
`;

export const PurchaseModalPaymentIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 1.5rem 1.25rem;

  img {
    height: 23px;
    width: 34px;
    object-fit: contain;
  }
`;
