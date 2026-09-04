import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";
import { MonoText } from "@/components/UI/Monotext";

export const Wrapper = styled.section`
  width: min(100%, ${GENERIC_CARD_LAYOUT.CONTENT_WIDTH});
  margin: 0 auto;
  padding: 40px 0;

  ${media.desktopMd} {
    width: 100%;
    padding: 40px 25px;
  }

  ${media.desktop} {
    width: 100%;
    padding: 40px 25px;
  }

  ${media.tablet} {
    width: 100%;
    padding: 2rem 1.75rem;
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

  ${media.desktopSm} {
    --creator-visible: 5;
  }

  ${media.tablet} {
    --creator-size: 100px;
    --creator-visible: 4;
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
