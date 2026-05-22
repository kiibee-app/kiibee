import { media } from "@repo/ui/breakpoints";
import styled, { css } from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  max-width: 1220px;
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

  ${media.tablet} {
    margin-top: 0.5rem;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
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

export const Hero = styled.div`
  position: relative;
  width: min(920px, 78%);
  aspect-ratio: 90 / 49;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2.25rem;
  margin-left: auto;
  margin-right: auto;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${media.tablet} {
    width: 100%;
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

export const ContentShell = styled.div`
  width: 100%;
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
  margin-bottom: 2.2rem;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const MainTitle = styled.h1`
  ${({ theme }) => theme.typography.Heading2};
  margin: 0;
  max-width: 780px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const BodyTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 760px;
  margin-top: 1.5rem;
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
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const InfoTagText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const MainAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 51px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  cursor: pointer;
  margin-bottom: 1rem;
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
  min-width: 95px;
`;

export const MetaLabelText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  ${({ theme }) => theme.typography.Body_Regular}
`;

export const MetaValueText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
`;
