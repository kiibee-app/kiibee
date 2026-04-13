import { media } from "@kiibee/ui/breakpoints";
import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 12.5rem;

  ${media.tablet} {
    padding: 2rem 2rem;
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
  justify-content: space-between;
  align-items: center;
  gap: 64px;
  align-self: stretch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  ${media.tablet} {
    padding: 0 2rem;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  gap: 7px;
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
