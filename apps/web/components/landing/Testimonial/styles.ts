import styled from "styled-components";
import breakpoints from "../../../../../packages/ui/src/breakpoints";

export const Section = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

export const SectionInner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 1.25rem;

  @media (max-width: calc(${breakpoints.tablet} - 1px)) {
    height: auto;
    min-height: 620px;
    padding: 0 1rem 5rem;
  }
`;

export const ArrowButton = styled.button<{ $left?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $left }) =>
    $left ? "left: clamp(12px, 4vw, 85px);" : "right: clamp(12px, 4vw, 85px);"}
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  background-color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.primary.WHITE} 60%,
    transparent
  );
  backdrop-filter: blur(4px);
  z-index: 10;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.WHITE} 75%,
      transparent
    );
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.WHITE};
    outline-offset: 2px;
  }

  @media (max-width: calc(${breakpoints.tablet} - 1px)) {
    top: auto;
    bottom: 1rem;
    transform: none;
    ${({ $left }) => ($left ? "left: 1rem;" : "right: 1rem;")}
  }
`;

export const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 26px;
  line-height: 0;

  svg {
    display: block;
    width: 13px;
    height: 26px;
  }
`;

export const Card = styled.div`
  position: absolute;
  top: clamp(80px, 10vw, 150px);
  right: clamp(80px, 14vw, 240px);
  display: flex;
  width: min(600px, calc(100% - 2rem));
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  border-radius: 20px;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 80%,
    transparent
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;

  @media (max-width: calc(${breakpoints.desktop} - 1px)) {
    right: 1rem;
    left: 1rem;
    width: auto;
    top: 1.5rem;
    padding: 1.25rem;
    gap: 1rem;
  }

  @media (max-width: calc(${breakpoints.tablet} - 1px)) {
    left: 50%;
    right: auto;
    top: 50%;
    width: min(520px, calc(100% - 2rem));
    transform: translate(-50%, -50%);
    align-items: center;
    text-align: center;
  }
`;

export const Quote = styled.p`
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Author = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;
