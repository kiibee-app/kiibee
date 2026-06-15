import styled, { keyframes } from "styled-components";
import {
  ImageWrapper as BaseImageWrapper,
  Footer as BaseCardFooter,
} from "@/components/UI/GenericCard/styles";
import { VideoBox as BaseVideoBox } from "@/components/Feature/TutorialVideos/TutorialCard/styles";
import { Card as BaseCreatorCardWrapper } from "@/components/Feature/ExploreCreators/TopCreators/styles";

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div`
  display: inline-block;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 25%,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 37%,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s infinite ease-in-out;
`;

export const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  height: 100%;
  border-radius: 12px 12px 0 0;
`;

export const SkeletonCategory = styled(SkeletonBase)`
  width: 30%;
  height: 1rem;
  margin: 0.25rem 0;
  border-radius: 4px;
`;

export const SkeletonTitle = styled(SkeletonBase)`
  width: 90%;
  height: 1.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
`;

export const SkeletonSubtitle = styled(SkeletonBase)`
  width: 50%;
  height: 1rem;
  margin: 0.25rem 0;
  border-radius: 4px;
`;

export const SkeletonDate = styled(SkeletonBase)`
  width: 40%;
  height: 0.85rem;
  margin: 0.25rem 0;
  border-radius: 4px;
`;

export const SkeletonVideo = styled(SkeletonBase)`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

export const SkeletonButton = styled(SkeletonBase)`
  width: 100%;
  height: 2.5rem;
  border-radius: 8px;
`;

export const SkeletonAvatar = styled(SkeletonBase)`
  width: 100%;
  height: 100%;
  border-radius: 90px;
`;

export const SkeletonCreatorName = styled(SkeletonBase)`
  width: 80px;
  height: 1.125rem;
  margin: 4px 0;
  border-radius: 4px;
`;

export const SkeletonCreatorSubs = styled(SkeletonBase)`
  width: 60px;
  height: 0.875rem;
  margin: 2px 0;
  border-radius: 4px;
`;

export const SkeletonSectionHeader = styled(SkeletonBase)`
  width: 150px;
  height: 1.75rem;
  border-radius: 4px;
`;

export const SkeletonSectionTag = styled(SkeletonBase)`
  width: 180px;
  height: 1.5rem;
  border-radius: 4px;
`;

export const SkeletonImageWrapper = styled(BaseImageWrapper)`
  padding: 0;
`;

export const SkeletonVideoBox = styled(BaseVideoBox)`
  border: none;
  padding: 0;
  overflow: hidden;
`;

export const SkeletonCardFooter = styled(BaseCardFooter)`
  margin-top: auto;
`;

export const SkeletonCreatorCardWrapper = styled(BaseCreatorCardWrapper)`
  cursor: default;
`;
