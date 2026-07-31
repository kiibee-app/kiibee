import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const Section = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  padding: clamp(4rem, 9.24vw, 8.3125rem) clamp(1.25rem, 7.7vw, 6.9375rem)
    clamp(3.5rem, 8.13vw, 7.3125rem);

  ${media.tablet} {
    padding: 3rem 1.25rem;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 76.125rem;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  min-width: 0;

  ${media.desktop} {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }
`;

export const ImageColumn = styled.div`
  flex: 1.2 1 0;
  min-width: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  > #cp-image-reveal {
    width: 100%;
  }

  ${media.desktop} {
    justify-content: center;
    flex: 1 1 auto;
  }
`;

export const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  ${media.tablet} {
    border-radius: 0.5rem;
  }
`;

export const DashboardImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: inherit;
  object-fit: cover;
`;

export const TextColumn = styled.div`
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};

  > [data-scroll-reveal] {
    width: 100%;
  }

  ${media.desktop} {
    flex: 1 1 auto;
    max-width: none;
  }
`;

export const Title = styled(MonoText).attrs({
  $use: "Heading2",
})`
  display: block;
  margin: 0;
  ${({ theme }) => theme.typography.Heading2};
  font-size: clamp(1.75rem, 2.2vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const Intro = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin: 1.25rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const ListIntro = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin: 1.25rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const PointsList = styled(MonoText).attrs({
  as: "ul",
  $use: "Body_Regular",
})`
  width: 100%;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const PointItem = styled(MonoText).attrs({
  as: "li",
  $use: "Body_Regular",
})`
  display: block;
  position: relative;
  padding-left: 1.25rem;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};

  > [data-scroll-reveal] {
    width: 100%;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0.55rem;
    left: 0;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.BLACK_90};
  }
`;

export const Outro = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin: 1.25rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;
