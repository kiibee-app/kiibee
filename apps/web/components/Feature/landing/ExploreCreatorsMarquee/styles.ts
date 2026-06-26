import styled, { keyframes } from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: clamp(3rem, 8vw, 6rem) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3.5rem);
  padding: 0 1.5rem;
  max-width: 800px;
`;

export const Title = styled.h2`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
`;

export const MarqueeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 200px;
    z-index: 10;
    pointer-events: none;

    ${media.tablet} {
      width: 80px;
    }
  }

  &::before {
    left: 0;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.neutral.OFF_WHITE} 0%,
      transparent 100%
    );
  }

  &::after {
    right: 0;
    background: linear-gradient(
      to left,
      ${({ theme }) => theme.colors.neutral.OFF_WHITE} 0%,
      transparent 100%
    );
  }
`;

export const MarqueeRow = styled.div`
  display: flex;
  width: max-content;
  overflow: hidden;
`;

const marqueeLeft = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
`;

const marqueeRight = keyframes`
  0% {
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

export const MarqueeTrackLeft = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0.75rem;
  animation: ${marqueeLeft} 40s linear infinite;
  will-change: transform;

  &:hover {
    animation-play-state: paused;
  }
`;

export const MarqueeTrackRight = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0.75rem;
  animation: ${marqueeRight} 40s linear infinite;
  will-change: transform;

  &:hover {
    animation-play-state: paused;
  }
`;

export const CreatorCard = styled.article`
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  border-radius: 16px;
  padding: 24px;
  width: 440px;
  height: 220px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 18px ${({ theme }) => theme.colors.neutral.GRAY_250};
  flex-shrink: 0;
  box-sizing: border-box;

  ${media.tablet} {
    width: 380px;
    height: 200px;
    padding: 16px;
    gap: 12px;
  }
`;

export const CardLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

export const CardTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  font-size: 1.25rem;
  font-weight: 700;

  ${media.tablet} {
    font-size: 1.125rem;
  }
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  width: fit-content;

  ${media.tablet} {
    padding: 2px 8px;
    font-size: 0.6875rem;
  }
`;

export const CardDescription = styled.p`
  margin: 8px 0 12px;
  ${({ theme }) => theme.typography.Body_SemiMedium};
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${media.tablet} {
    margin: 6px 0 10px;
    -webkit-line-clamp: 2;
  }
`;

export const ProfileButton = styled.a`
  background: ${({ theme }) => theme.colors.neutral.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 8px 18px;
  border-radius: 99px;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  width: fit-content;
  text-align: center;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  ${media.tablet} {
    padding: 6px 14px;
    font-size: 0.75rem;
  }
`;

export const CardRight = styled.div`
  width: 120px;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;

  ${media.tablet} {
    width: 90px;
  }
`;

export const BottomCta = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SeeAllButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.LG,
})`
  background: ${({ theme }) => theme.colors.neutral.BLACK};
  border-color: ${({ theme }) => theme.colors.neutral.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.BLACK_90};
    border-color: ${({ theme }) => theme.colors.primary.BLACK_90};
  }
`;
