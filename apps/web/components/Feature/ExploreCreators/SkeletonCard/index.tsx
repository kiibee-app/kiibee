import styled, { css, keyframes } from "styled-components";

const shimmerKeyframes = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

const shimmer = css`
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

export const SkeletonRow = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "16px"};
  ${shimmer}
`;

export const SkeletonAvatar = styled.div`
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
