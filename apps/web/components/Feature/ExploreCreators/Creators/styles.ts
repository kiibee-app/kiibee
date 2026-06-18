import { media } from "@repo/ui/breakpoints";
import styled, { css, keyframes } from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  padding: 85px 112px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 100px;
  ${media.tablet} {
    padding: 40px 24px;
  }
`;

export const LoadMoreRow = styled.div`
  align-self: center;
`;

export const Grid = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));
  justify-content: center;
  gap: 20px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: 12px;
  gap: 8px;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  min-height: 315px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 0 10.483px 0 ${({ theme }) => theme.colors.gradient.CARD_SHADOW};
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  min-height: 190px;
  padding: 12px 178px 154px 10px;
  align-items: center;
  align-self: stretch;
  border-radius: 12px 12px 0 0;
  ${media.tablet} {
    padding: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 5px 8px;
  border-radius: 5px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.colors.primary.GREEN_50};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  width: 100%;
`;

const shimmerKeyframes = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

export const shimmer = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 25%,
    ${({ theme }) => theme.colors.neutral.OFF_WHITE} 50%,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmerKeyframes} 1.5s ease-in-out infinite;
  border-radius: 6px;
`;

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: 12px;
  gap: 8px;
  align-items: stretch;
  min-height: 280px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 0 10.483px 0 ${({ theme }) => theme.colors.gradient.CARD_SHADOW};
`;

export const SkeletonImage = styled.div`
  width: 100%;
  min-height: 200px;
  border-radius: 12px 12px 0 0;
  aspect-ratio: 5 / 4;
  ${shimmer}
`;

export const SkeletonRow = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "16px"};
  ${shimmer}
`;

export const SkeletonAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  ${shimmer}
`;

export const SkeletonTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
`;

export const SkeletonTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const CreatorSkeletonFooter = styled.div`
  width: 100%;
  margin-top: auto;
  ${shimmer}
  height: 40px;
  border-radius: 8px;
`;

export const SkeletonBadge = styled.div`
  width: 60px;
  height: 22px;
  border-radius: 5px;
  ${shimmer}
`;

export const SkeletonTitle = styled.div`
  width: 80%;
  height: 18px;
  ${shimmer}
`;

export const SkeletonSubtitle = styled.div`
  width: 50%;
  height: 14px;
  ${shimmer}
`;

export const LargeSkeletonAvatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 90px;
  flex-shrink: 0;
  ${shimmer}
`;

export const SkeletonAvatarName = styled.div`
  width: 80px;
  height: 14px;
  ${shimmer}
`;

export const SkeletonAvatarSubscribers = styled.div`
  width: 60px;
  height: 12px;
  ${shimmer}
`;

export const SkeletonFooter = styled.div`
  width: 100%;
  margin-top: auto;
  height: 40px;
  border-radius: 8px;
  ${shimmer}
`;

export const ErrorFallbackContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 24px;
  gap: 16px;
`;
