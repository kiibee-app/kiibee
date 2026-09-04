import styled from "styled-components";
import breakpoints from "@repo/ui/breakpoints";
import COLORS from "@repo/ui/colors";
import { type CSSProperties } from "react";
import { FOR_CREATORS_LAYOUT } from "@/utils/forCreatorsLayout";

export const Section = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: ${COLORS.primary.GRAY};
  padding: 0 ${FOR_CREATORS_LAYOUT.sectionPaddingX};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 0 1.25rem;
  }
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  max-width: ${FOR_CREATORS_LAYOUT.contentMaxWidth};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;

  @media (min-width: ${breakpoints.tablet}) {
    padding-top: 5rem;
    padding-bottom: 5.5rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: ${FOR_CREATORS_LAYOUT.contentMaxWidth};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 4rem;
  box-sizing: border-box;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: stretch;
    gap: 2.5rem;
    padding-bottom: 4rem;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  display: none;

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    width: 48%;
  }
`;

export const StickyImageWrapper = styled.div`
  position: sticky;
  top: calc(var(--navbar-height, 73px) + 6.5rem);
  width: 100%;
  aspect-ratio: 1146 / 710;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${COLORS.primary.GRAY};
  background: ${COLORS.primary.GREEN_100};
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
    width: 52%;
    padding-bottom: 0;
  }
`;

export const Title = styled.h2`
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
  margin-bottom: 0;
  margin-top: 0;
  text-align: center;

  @media (min-width: ${breakpoints.tablet}) {
  }
`;

export const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StepWrapper = styled.div<{ $minHeight?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0;
  padding-bottom: 2.5rem;

  &:last-child {
    padding-bottom: 0;
  }

  @media (min-width: ${breakpoints.tablet}) {
    min-height: ${({ $minHeight }) =>
      $minHeight ? `${Math.round($minHeight * 0.78)}px` : "18rem"};
    justify-content: center;
    padding-top: 0;
    padding-bottom: 0;

    &:last-child {
      min-height: ${({ $minHeight }) =>
        $minHeight ? `${Math.round($minHeight * 0.78)}px` : "18rem"};
      justify-content: center;
      padding-bottom: 0;
      margin-bottom: 2.75rem;
    }
  }
`;

export const MobileStepImage = styled.div`
  width: 100%;
  aspect-ratio: 1146 / 710;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${COLORS.primary.GRAY};
  background: ${COLORS.primary.GREEN_100};
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

export const stepImageStyle: CSSProperties = {
  objectFit: "cover",
  objectPosition: "center",
};

export const STEP_IMAGE_SIZES = {
  desktop: "(max-width: 767px) 100vw, 48vw",
  mobile: "100vw",
} as const;
