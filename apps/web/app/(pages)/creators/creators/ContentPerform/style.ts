import styled from "styled-components";
import { media } from "@kiibee/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const Section = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(3.5rem, 7vw, 6rem) 0;
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 0 clamp(1rem, 4vw, 2rem);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 4vw, 4rem);

  ${media.desktop} {
    grid-template-columns: 1fr;
  }
`;

export const ImageColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const ImageFrame = styled.div`
  position: relative;
  width: min(100%, 42rem);
  border-radius: 1.25rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.gredint.FRAME_BG};
  border: 1px solid ${({ theme }) => theme.colors.gredint.FRAME_BORDER};
  box-shadow: ${({ theme }) => theme.shadows.frame};

  &::before {
    content: "";
    position: absolute;
    inset: -0.75rem;
    border-radius: 1.75rem;
    background: ${({ theme }) => theme.colors.gredint.FRAME_GLOW};
    filter: blur(1rem);
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    left: 7%;
    right: 7%;
    bottom: -1.4rem;
    height: 16%;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.gredint.FRAME_SHADOW};
    filter: blur(1.2rem);
    z-index: 0;
  }

  ${media.desktop} {
    width: 100%;
  }

  ${media.tablet} {
    border-radius: 1rem;
    padding: 0.125rem;
  }
`;

export const DashboardImage = styled.img`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  border-radius: 1.05rem;
  object-fit: cover;
`;

export const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const Title = styled(MonoText).attrs({
  $use: "Heading2",
})`
  display: block;
  margin: 0;
  ${({ theme }) => theme.typography.Heading2};
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const Intro = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin: 1.5rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const ListIntro = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin: 1.75rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const PointsList = styled(MonoText).attrs({
  as: "ul",
  $use: "Body_Regular",
})`
  width: 100%;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.875rem;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const PointItem = styled(MonoText).attrs({
  as: "li",
  $use: "Body_Regular",
})`
  display: block;
  position: relative;
  padding-left: 1.5rem;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};

  &::before {
    content: "";
    position: absolute;
    top: 0.65rem;
    left: 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.BLACK_90};
  }
`;

export const Outro = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin: 1.75rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;
