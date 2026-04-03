import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  width: 100%;
  margin: 0;
  overflow: hidden;
  background: #06210f;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const Card = styled.div<{
  $left?: number;
  $top?: number;
  $width?: number;
  $height?: number;
  $mobileOnly?: boolean;
}>`
  left: ${({ $left = 0 }) => `${$left}%`};
  top: ${({ $top = 0 }) => `${$top}%`};
  width: ${({ $width = 20 }) => `${$width}%`};
  height: ${({ $height = 30 }) => `${$height}%`};
  position: absolute;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.45);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);

  @media (max-width: 900px) {
    position: ${({ $mobileOnly }) => ($mobileOnly ? "relative" : "absolute")};
    left: auto;
    top: auto;
    width: ${({ $mobileOnly }) => ($mobileOnly ? "100%" : "18%")};
    height: ${({ $mobileOnly }) => ($mobileOnly ? "114px" : "28%")};
  }
`;

export const MobileBackdrop = styled.div`
  display: none;
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
`;

export const MobileGrid = styled.div`
  width: 114%;
  height: 102%;
  margin-left: -7%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 540px) {
    width: 118%;
    margin-left: -9%;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.67) contrast(1.18);
`;

export const CardTint = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(4, 34, 14, 0.36);
`;

export const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      180deg,
      rgba(3, 24, 10, 0.66) 0%,
      rgba(3, 20, 9, 0.36) 45%,
      rgba(3, 20, 9, 0.72) 100%
    ),
    linear-gradient(
      90deg,
      rgba(3, 41, 12, 0.9) 0%,
      rgba(3, 41, 12, 0.46) 22%,
      rgba(3, 41, 12, 0.06) 48%,
      rgba(3, 41, 12, 0.46) 78%,
      rgba(3, 41, 12, 0.9) 100%
    );
`;

export const VignetteOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(0, 0, 0, 0.02) 0%,
      rgba(0, 0, 0, 0.42) 100%
    ),
    linear-gradient(
      90deg,
      rgba(5, 35, 14, 0.35) 0%,
      rgba(5, 35, 14, 0) 14%,
      rgba(5, 35, 14, 0) 86%,
      rgba(5, 35, 14, 0.35) 100%
    );
`;

export const Content = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  width: 1440px;
  height: 593px;
  max-width: 100%;
  margin: 0 auto;
  padding: 120px 429px 120.04px 429px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: #ffffff;
  box-sizing: border-box;

  @media (max-width: 1280px) {
    width: 100%;
    height: auto;
    padding: 100px 240px;
  }

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    padding: 72px 48px;
  }

  @media (max-width: 640px) {
    width: 100%;
    height: auto;
    padding: 64px 24px;
  }
`;

export const Brand = styled.div`
  margin: 0 0 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 640px) {
    margin-bottom: 32px;
  }
`;

export const BrandLogo = styled.span`
  position: relative;
  display: block;
  width: 126px;
  height: 37px;

  @media (max-width: 640px) {
    width: 116px;
    height: 34px;
  }
`;

export const Heading = styled.h1`
  margin: 0 0 30px;
  color: #fff;
  text-align: center;
  font-family: "Reddit Sans", sans-serif;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  @media (max-width: 640px) {
    font-size: 32px;
    margin-bottom: 22px;
  }
`;

export const Subtitle = styled.p`
  margin: 0 0 50px;
  max-width: 760px;
  color: #fff;
  text-align: center;
  font-family: "Reddit Sans", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media (max-width: 640px) {
    font-size: 15px;
    margin-bottom: 32px;
  }
`;

export const CTAButton = styled.button`
  margin-top: 0;
  display: flex;
  height: 49px;
  padding: 14px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #060606;
  color: #fff;
  font-family: "Reddit Sans", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    border-color 160ms ease;

  &:hover {
    background: transparent;
    color: #fff;
    border-color: #060606;
  }
`;
