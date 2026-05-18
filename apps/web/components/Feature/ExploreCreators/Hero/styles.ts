import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const Hero = styled.section`
  width: 100%;
  position: relative;
  z-index: 20;
  isolation: isolate;
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
`;

export const Inner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 90px 20px 30px 20px;
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const Title = styled.h1`
  text-align: center;
`;

export const HeroTitleText = styled(MonoText).attrs({
  $use: "Heading2",
})`
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const Controls = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;

  ${media.mobile} {
    flex-wrap: nowrap;
  }
`;

export const FilterControlWrap = styled.div`
  position: relative;
  flex: 0 0 auto;
  z-index: 200;
`;

export const FilterBtn = styled.button<{ $active: boolean }>`
  min-height: 48px;
  padding: 0 18px 0 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.neutral.WHITE : theme.colors.neutral.OFF_WHITE};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary.BLACK : theme.colors.primary.GRAY};
  gap: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  white-space: nowrap;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: block;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }

  ${media.tablet} {
    flex: 0 0 auto;
    min-width: 136px;
  }
`;

export const FilterButtonText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const FilterOverlay = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 210;
  width: min(26rem, calc(100vw - 40px));
  max-height: min(70vh, 720px);
  overflow-y: auto;
  padding: 24px 24px 18px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  box-shadow: 0 28px 60px ${({ theme }) => theme.colors.gredint.CARD_SHADOW};

  ${media.tablet} {
    width: min(24rem, calc(100vw - 32px));
    padding: 22px 20px 18px;
  }
`;

export const FilterHeader = styled.div`
  margin-bottom: 8px;
`;

export const FilterTitle = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  display: block;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const FilterSections = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FilterSection = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const FilterSectionButton = styled.button`
  width: 100%;
  padding: 18px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: ${({ theme }) => theme.colors.gredint.TRANSPARENT};
  cursor: pointer;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 4px;
  }
`;

export const FilterSectionTitle = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const FilterSectionBody = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    grid-template-rows ${({ theme }) => theme.animations.normal},
    opacity ${({ theme }) => theme.animations.normal};
`;

export const FilterSectionBodyInner = styled.div<{ $open: boolean }>`
  min-height: 0;
  overflow: hidden;
  padding: ${({ $open }) => ($open ? "0 0 16px" : "0")};
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
`;

export const RatingOption = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
`;

export const OptionText = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const CheckboxControl = styled.span<{
  $checked: boolean;
  $round?: boolean;
}>`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${({ theme }) => theme.colors.primary.BLACK};
  border-radius: ${({ $round }) => ($round ? "50%" : "7px")};
  background: ${({ theme }) => theme.colors.gredint.TRANSPARENT};
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &::after {
    content: "";
    width: ${({ $round }) => ($round ? "10px" : "12px")};
    height: ${({ $round }) => ($round ? "10px" : "12px")};
    border-radius: ${({ $round }) => ($round ? "50%" : "4px")};
    background: ${({ theme }) => theme.colors.primary.BLACK};
    transform: scale(${({ $checked }) => ($checked ? 1 : 0)});
    transition: transform 0.2s ease;
  }
`;

export const ShowMoreButton = styled.button`
  margin-top: 14px;
  padding: 0;
  border: none;
  background: ${({ theme }) => theme.colors.gredint.TRANSPARENT};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
`;

export const ShowMoreText = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PriceFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PriceField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PriceFieldLabel = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PriceInputWrapper = styled.div`
  min-height: 68px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1.25px solid ${({ theme }) => theme.colors.neutral.GRAY_400};
  border-radius: 12px;
`;

export const PriceValue = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.25px solid ${({ theme }) => theme.colors.neutral.GRAY_400};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const PriceInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: ${({ theme }) => theme.colors.gredint.TRANSPARENT};
  ${({ theme }) => theme.typography.Heading3};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};

  &::placeholder {
    ${({ theme }) => theme.typography.Heading3};
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
`;

export const RatingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RatingStars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const StarIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const StarIcon = styled.svg<{ $filled: boolean }>`
  width: 100%;
  height: 100%;
  display: block;

  path {
    fill: ${({ $filled, theme }) =>
      $filled ? theme.colors.primary.BLACK : theme.colors.gredint.TRANSPARENT};
    stroke: ${({ theme }) => theme.colors.primary.BLACK};
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
`;

export const SortBox = styled.div<{
  $width?: string;
  $maxWidth?: string;
  $variant?: "default" | "surface";
}>`
  position: relative;
  width: ${({ $width }) => $width || "100%"};
  max-width: ${({ $maxWidth }) => $maxWidth || "200px"};
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $variant }) =>
    $variant === "surface" ? "10px 16px" : "13px 15px"};
  background: ${({ theme, $variant }) =>
    $variant === "surface"
      ? theme.colors.primary.WHITE
      : theme.colors.neutral.OFF_WHITE};
  border-radius: ${({ $variant }) => ($variant === "surface" ? "8px" : "12px")};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "surface"
        ? theme.colors.neutral.GRAY_200
        : theme.colors.primary.GRAY};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
`;

export const Dropdown = styled.div<{
  $maxWidth?: string;
  $variant?: "default" | "surface";
}>`
  position: absolute;
  top: 120%;
  right: 0;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || "200px"};
  padding: ${({ $variant }) => ($variant === "surface" ? "8px" : "12px")};
  background: ${({ theme, $variant }) =>
    $variant === "surface"
      ? theme.colors.primary.WHITE
      : theme.colors.neutral.OFF_WHITE};
  border-radius: ${({ $variant }) => ($variant === "surface" ? "8px" : "12px")};
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
`;

export const DropdownItem = styled.div<{ $variant?: "default" | "surface" }>`
  padding: ${({ $variant }) =>
    $variant === "surface" ? "10px 12px" : "12px 14px"};
  border-radius: ${({ $variant }) => ($variant === "surface" ? "8px" : "12px")};
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const Text = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SortText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
