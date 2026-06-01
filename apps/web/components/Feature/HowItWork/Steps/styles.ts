import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const StepsSection = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 3.5rem 1.25rem 4.5rem;
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.25rem;
`;

export const Heading = styled.h2`
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

export const Subtitle = styled.p`
  margin: 0 auto 2rem auto;
  text-align: center;
  max-width: 580px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem 1rem;
  align-items: end;
  justify-content: center;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  transition:
    transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 280ms cubic-bezier(0.2, 0.8, 0.2, 1);

  img {
    object-fit: cover;
    transition: transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1) !important;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 500px;
  cursor: pointer;

  &:hover {
    ${ImgWrap} {
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
    }
    img {
      transform: scale(1.04) !important;
    }
  }

  &:nth-child(1) {
    ${ImgWrap} {
      padding-top: 70%;
      transform: translateY(0px);
    }
    &:hover {
      ${ImgWrap} {
        transform: translateY(-8px);
      }
    }
  }

  &:nth-child(2) {
    ${ImgWrap} {
      padding-top: 85%;
      transform: translateY(0px);
    }
    &:hover {
      ${ImgWrap} {
        transform: translateY(-8px);
      }
    }
  }

  &:nth-child(3) {
    ${ImgWrap} {
      padding-top: 105%;
      transform: translateY(-2px);
    }
    &:hover {
      ${ImgWrap} {
        transform: translateY(-10px);
      }
    }
  }
`;

export const CardTitle = styled.h3`
  ${({ theme }) => theme.typography.H5_Medium};
  padding: 1rem 0 0 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${media.tablet} {
    padding: 0.5rem 0 0 0;
  }
`;

export const CardText = styled.p`
  ${({ theme }) => theme.typography.Body_Medium};
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  ${media.tablet} {
    padding-bottom: 1rem;
  }
`;
