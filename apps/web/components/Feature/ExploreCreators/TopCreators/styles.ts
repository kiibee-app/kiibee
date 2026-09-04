import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

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
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 0.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.tablet} {
    gap: 28px;
  }

  ${media.mobile} {
    gap: 20px;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  flex-shrink: 0;
  scroll-snap-align: start;
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

  ${media.tablet} {
    min-width: 100px;
  }
`;

export const Avatar = styled.div`
  min-width: 150px;
  min-height: 150px;
  border-radius: 90px;
  overflow: hidden;
  position: relative;
`;
