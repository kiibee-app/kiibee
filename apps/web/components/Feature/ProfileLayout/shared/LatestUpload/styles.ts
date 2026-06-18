import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { SIZE, VARIANT } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

type ReadMoreTone = typeof VARIANT.PRIMARY | typeof VARIANT.SECONDARY;

export const Section = styled.section<{
  $padding?: string;
  $maxWidth?: string;
}>`
  width: ${({ $maxWidth }) =>
    $maxWidth ? `min(100%, ${$maxWidth})` : "min(100%, 1300px)"};
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: ${({ $padding }) => $padding || "10px"};

  ${media.tablet} {
    width: 100%;
    padding: 10px;
  }
`;

export const ContentWrapper = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ $isMobile }) => ($isMobile ? "2rem" : "2.5rem")};
  padding-top: 20px;

  ${media.tablet} {
    flex-direction: column;
    gap: 2rem;
    align-items: stretch;
  }
`;

export const ImageSection = styled.div<{
  $width?: string;
  $height?: string;
  $padding?: string;
  $flexDirection?: string;
  $justifyContent?: string;
  $alignItems?: string;
  $gap?: string;
}>`
  position: relative;
  width: ${({ $width }) => $width || "min(100%, 640px)"};
  height: ${({ $height }) => $height || "auto"};
  ${({ $width, $height }) =>
    !$width || !$height ? "aspect-ratio: 39.5724 / 21.5625;" : ""}
  padding: ${({ $padding }) => $padding || "0"};
  display: flex;
  flex-direction: ${({ $flexDirection }) => $flexDirection || "column"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "flex-end"};
  align-items: ${({ $alignItems }) => $alignItems || "stretch"};
  gap: ${({ $gap }) => $gap || "0"};
  border-radius: 0.5rem;
  overflow: hidden;
  flex: 0 0 auto;

  ${media.tablet} {
    width: 100%;
    height: auto;
    aspect-ratio: 39.5724 / 21.5625;
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
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 1;
`;

export const TextSection = styled.div`
  flex: 1;
  width: 100%;
  max-width: 560px;
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

export const ActionButtons = styled.div`
  margin-top: 0.625rem;
  display: flex;
  align-items: stretch;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ReadMoreButton = styled(GenericButton).attrs<{
  $tone?: ReadMoreTone;
}>(({ $tone }) => ({
  size: SIZE.SM,
  variant: $tone === VARIANT.PRIMARY ? VARIANT.PRIMARY : VARIANT.SECONDARY,
}))<{ $tone?: ReadMoreTone }>`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-height: 60px;
    padding: 0.5rem 0.9375rem;
    border-radius: 0.75rem;
    background: ${({ theme, $tone }) =>
      $tone === VARIANT.PRIMARY
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY_200};
    color: ${({ theme, $tone }) =>
      $tone === VARIANT.PRIMARY
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    border: none;
    box-shadow: none;
    transform: none;
  }

  &&:not([type="submit"]):hover {
    background: ${({ theme, $tone }) =>
      $tone === VARIANT.PRIMARY
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY_200};
    color: ${({ theme, $tone }) =>
      $tone === VARIANT.PRIMARY
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    border: none;
    box-shadow: none;
    transform: none;
    opacity: 1;
  }
`;

export const ActionMainText = styled(MonoText).attrs<{
  $tone?: ReadMoreTone;
}>(({ $tone, theme }) => ({
  $use: "Body_SemiBold",
  color:
    $tone === VARIANT.PRIMARY
      ? theme.colors.neutral.OFF_WHITE
      : theme.colors.primary.BLACK,
}))<{ $tone?: ReadMoreTone }>`
  line-height: 1.1;
`;

export const ActionSubText = styled(MonoText).attrs<{
  $tone?: ReadMoreTone;
}>(({ $tone, theme }) => ({
  $use: "Body_Small",
  color:
    $tone === VARIANT.PRIMARY
      ? theme.colors.primary.WHITE_90
      : theme.colors.neutral.GRAY_400,
}))<{ $tone?: ReadMoreTone }>`
  line-height: 1.1;
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
  text-transform: capitalize;

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

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 120px 24px 24px;
  box-sizing: border-box;
  gap: 10px;

  ${media.tablet} {
    padding: 80px 16px 16px;
  }
`;

export const ModalDescription = styled(MonoText)`
  max-width: 420px;
  line-height: 1.6;
`;
