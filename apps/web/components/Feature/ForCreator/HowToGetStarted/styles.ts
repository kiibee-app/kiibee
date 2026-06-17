import styled from "styled-components";
import breakpoints from "@repo/ui/breakpoints";
import COLORS from "@repo/ui/colors";

export const Section = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${COLORS.primary.GRAY};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 4rem 20px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    gap: 4rem;
    padding: 6rem 60px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 6rem 111px;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  display: none;

  @media (min-width: ${breakpoints.tablet}) {
    display: block;
    width: 45%;
  }
`;

export const StickyImageWrapper = styled.div`
  position: sticky;
  top: 8rem;
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${COLORS.primary.GRAY};
  background: ${COLORS.primary.WHITE};
`;

export const ImageWrapper = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.4s ease-in-out;
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
`;

export const ContentContainer = styled.div`
  width: 100%;
  padding-bottom: 10vh;

  @media (min-width: ${breakpoints.tablet}) {
    width: 55%;
    padding-bottom: 0;
  }
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.Heading2};
  color: ${COLORS.gradient.NEAR_BLACK};
  font-family:
    "Reddit Sans",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 3rem;
  margin-top: 0;

  @media (min-width: ${breakpoints.tablet}) {
  }
`;

export const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 20vh;
  padding-bottom: 7.5rem;

  &:last-child {
    padding-bottom: 0;
  }

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 0;
    padding-bottom: 7.75rem;

    &:last-child {
      padding-bottom: 0;
    }
  }
`;

export const MobileStepImage = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${COLORS.primary.GRAY};
  background: ${COLORS.primary.WHITE};
  margin-bottom: 1.5rem;
  position: relative;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

export const StepTitle = styled.h2`
  ${({ theme }) => theme.typography.Heading3};
  color: ${COLORS.gradient.NEAR_BLACK};
  font-family:
    "Reddit Sans",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 0.75rem;

  @media (min-width: ${breakpoints.tablet}) {
  }
`;

export const StepDescription = styled.p`
  ${({ theme }) => theme.typography.H5_Medium};
  color: ${COLORS.gradient.NEAR_BLACK};
  font-family:
    "Reddit Sans",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 0;

  @media (min-width: ${breakpoints.tablet}) {
  }
`;

export const StepList = styled.ul`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 0;
  list-style: none;
`;

export const ListItem = styled.li`
  ${({ theme }) => theme.typography.H5_Medium};
  display: flex;
  align-items: flex-start;
  color: ${COLORS.gradient.NEAR_BLACK};
  font-family:
    "Reddit Sans",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media (min-width: ${breakpoints.tablet}) {
  }
`;

export const Bullet = styled.span`
  flex-shrink: 0;
  height: 0.375rem;
  width: 0.375rem;
  border-radius: 50%;
  background: ${COLORS.gradient.NEAR_BLACK};
  margin-top: 0.625rem;
  margin-right: 0.75rem;
`;

export const Spacer = styled.div`
  height: 5vh;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;
