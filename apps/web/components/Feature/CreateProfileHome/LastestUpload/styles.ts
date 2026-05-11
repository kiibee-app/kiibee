import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const Section = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 35px 110px 0 110px;

  ${media.tablet} {
    padding: 2.5rem 1.25rem;
  }
`;

export const ContentWrapper = styled.div<{ $isMobile: boolean }>`
  width: min(100%, 90rem);
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $isMobile }) => ($isMobile ? "2rem" : "2.5rem")};
  flex: 1 0 0;
  padding-top: 20px;

  ${media.tablet} {
    flex-direction: column;
    gap: 2rem;
    align-items: stretch;
  }
`;

export const ImageSection = styled.div`
  position: relative;
  width: min(100%, 39.5724rem);
  aspect-ratio: 39.5724 / 21.5625;
  border-radius: 0.5rem;
  overflow: hidden;

  ${media.tablet} {
    width: 100%;
    padding: 0;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
  z-index: 2;
`;

export const UploadImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const TextSection = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

export const Title = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin: 0;
  align-self: stretch;
`;

export const Paragraph = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  margin: 0;
  align-self: stretch;
`;

export const ReadMoreButton = styled(GenericButton).attrs({
  variant: VARIANT.SECONDARY,
  size: SIZE.SM,
})`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-top: 0.625rem;
  padding: 0.5rem 0.9375rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.primary.GRAY};
  border: none;
  gap: 0.25rem;

  span:first-child {
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
  &:hover {
    background: ${({ theme }) => theme.colors.primary.BLACK};

    span:first-child {
      color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    }

    span:last-child {
      color: ${({ theme }) => theme.colors.primary.WHITE_90};
    }
  }
`;

export const Badge = styled(MonoText).attrs({
  $use: "Body_Bold",
})`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 0.3125rem 0.625rem;
  border-radius: 0.3125rem;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GREEN_50};
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;

export const BottomControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const LeftControlButton = styled(GenericButton).attrs({
  size: SIZE.SM,
})`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.3125rem 0.625rem;
  border-radius: 0.3125rem;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  border: none;
`;

export const RightControlButton = styled(GenericButton).attrs({
  size: SIZE.MD,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  height: 3.1875rem;
  padding: 0.625rem 0.9375rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border: none;
`;
