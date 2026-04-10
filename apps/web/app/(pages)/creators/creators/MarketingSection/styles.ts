import styled from "styled-components";
import Image from "next/image";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: inline-flex;
  padding: 88px 113px 148px 114px;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${media.desktop} {
    display: flex;
    padding: 2.5rem 1.25rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 68.75rem;
  display: flex;
  align-items: center;
  gap: 3.75rem;

  ${media.desktop} {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const TextColumn = styled.div`
  flex: 1;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled.h2`
  margin: 0 0 1.5rem;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  ${({ theme }) => theme.typography.Heading2};
`;

export const Description = styled.p`
  margin: 0 0 1.25rem;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const ListIntro = styled.p`
  margin: 0 0 0.5rem;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const BulletList = styled.ul`
  margin: 0 0 1.5rem;
  padding-left: 1.125rem;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const BulletItem = styled.li`
  margin-bottom: 0.25rem;
`;

export const Summary = styled.p`
  margin: 0 0 2rem;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const CtaButton = styled.button`
  display: flex;
  height: 49px;
  padding: 14px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Medium};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    color: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  }
`;

export const ImagesColumn = styled.div`
  flex: 1.2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 34.375rem;

  ${media.desktop} {
    width: 100%;
    height: 32rem;
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

export const LeftImageWrap = styled.div`
  height: 100%;
`;

export const RightImagesWrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
`;

export const ImageCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: 0.75rem;
  overflow: hidden;

  ${media.tablet} {
    min-height: 16rem;
  }
`;

export const TallImage = styled(Image).attrs({
  sizes: "(max-width: 768px) 100vw, 42vw",
})`
  object-fit: cover;
  object-position: right center;
`;

export const CardImage = styled(Image).attrs({
  sizes: "(max-width: 768px) 100vw, 24vw",
})`
  object-fit: cover;
`;

export const OverlayTall = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.gredint.BLACK_90} 0%,
    ${({ theme }) => theme.colors.gredint.TRANSPARENT} 30%,
    ${({ theme }) => theme.colors.gredint.BLACK_90} 100%
  );
`;

export const OverlayCard = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.gredint.BLACK_90} 0%,
    ${({ theme }) => theme.colors.gredint.TRANSPARENT} 40%,
    ${({ theme }) => theme.colors.gredint.BLACK_90} 100%
  );
`;

export const StatText = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Heading2};
`;

export const SupportText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Medium};
`;
