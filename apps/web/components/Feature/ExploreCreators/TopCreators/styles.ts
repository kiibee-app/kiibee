import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Wrapper = styled.section`
  width: min(100%, 1300px);
  margin: 0 auto;
  padding: 40px 0;

  ${media.tablet} {
    width: 100%;
    padding: 2rem 0;
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
  align-items: center;
  gap: 73px;
  align-self: stretch;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  padding-right: 2rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.tablet} {
    gap: 60px;
    padding: 0 1.25rem 0.25rem 1.25rem;
  }

  ${media.mobile} {
    gap: 50px;
    padding: 0 1rem 0.25rem 1rem;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
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
