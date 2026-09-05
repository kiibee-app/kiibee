import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import { exploreSectionFrame } from "@/styles/exploreCardGrid";

export const Wrapper = styled.section`
  ${exploreSectionFrame}
  container-type: inline-size;
  padding-top: 40px;
  padding-bottom: 40px;

  ${media.tablet} {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SeeAll = styled.a`
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const List = styled.div`
  --creator-size: 150px;
  --creator-visible: 6;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: calc(
    (100% - (var(--creator-size) * var(--creator-visible))) /
      (var(--creator-visible) - 1)
  );

  &::-webkit-scrollbar {
    display: none;
  }

  @container (max-width: 899px) {
    --creator-visible: 5;
  }

  @container (max-width: 749px) {
    --creator-visible: 4;
  }

  @container (max-width: 599px) {
    --creator-visible: 3;
  }

  ${media.tablet} {
    --creator-size: 100px;
    --creator-visible: 4;
  }

  ${media.mobileLg} {
    --creator-visible: 3;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--creator-size, 150px);
  min-width: var(--creator-size, 150px);
  max-width: var(--creator-size, 150px);
  flex-shrink: 0;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  gap: 7px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    opacity 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

export const Avatar = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

export const CreatorName = styled(MonoText)`
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  line-height: 1.2;
`;

export const CreatorMeta = styled(MonoText)`
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  line-height: 1.2;
`;
