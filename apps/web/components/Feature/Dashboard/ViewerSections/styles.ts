import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { SIZE, VARIANT } from "@/utils/Constants";

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
  margin-bottom: 35px;
  margin-top: 15px;
  width: 100%;
`;

export const PageWrap = styled.div<{ $expandedCollections?: boolean }>`
  padding: ${({ $expandedCollections }) =>
    $expandedCollections ? "40px 30px 40px" : "40px 30px"};
  margin-right: 30px;
  margin-left: 20px;

  ${media.tablet} {
    padding: ${({ $expandedCollections }) =>
      $expandedCollections ? "28px 20px 20px" : "20px"};
    margin-right: 10px;
  }
`;

export const SectionBlock = styled.section`
  margin-top: 35px;

  &:first-of-type {
    margin-top: 24px;
  }
`;

export const SectionTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const SectionTitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const SectionHeader = styled.div<{ $withMetaHeader?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  padding-inline: 0;

  ${media.tablet} {
    ${({ $withMetaHeader }) =>
      $withMetaHeader
        ? `
      flex-wrap: wrap;
      align-items: flex-start;
      row-gap: 8px;
    `
        : ""}
  }
`;

export const SectionArrow = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  transition: opacity 120ms ease;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const InlineSectionArrow = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  padding: 0;
  cursor: pointer;
`;

export const SectionArrows = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const CollectionMetaHeader = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 56px;
  margin-left: auto;
  flex-shrink: 0;

  ${media.tablet} {
    width: 100%;
    margin-left: 0;
    gap: 32px;
  }

  ${media.mobileLg} {
    justify-content: space-between;
    gap: 12px;
  }
`;

export const CollectionMetaHeaderItem = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_500};
  ${({ theme }) => theme.typography.Body_Regular};
  white-space: nowrap;
  transition: color 120ms ease;

  ${media.mobileLg} {
    font-size: 14px;
    gap: 8px;
  }
`;

export const CollectionMetaSortArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  gap: 2px;
  color: inherit;

  > span {
    display: inline-block;
    font-size: 12px;
    line-height: 1;
  }
`;

export const HeaderTitleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  padding: 0;
  cursor: pointer;
`;

export const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: 16px;
  padding-inline: 0;

  ${media.mobileLg} {
    gap: 12px;
  }
`;

export const CollectionCard = styled.article`
  display: flex;
  gap: 12px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 18px;

  ${media.mobileLg} {
    flex-direction: column;
  }
`;

export const CollectionImageWrap = styled.div`
  position: relative;
  width: 188px;
  min-width: 188px;
  height: 188px;
  border-radius: 12px;
  overflow: hidden;

  ${media.mobileLg} {
    width: 100%;
    min-width: 0;
  }
`;

export const CollectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CollectionBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary.GREEN_50};
  padding: 6px 10px;
  ${({ theme }) => theme.typography.Body_Bold};
`;

export const CollectionBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  min-width: 0;
  align-self: stretch;
`;

export const ElementsPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  padding: 8px 10px;
  align-self: flex-start;
`;

export const CollectionActionRow = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  align-items: stretch;

  > * {
    width: auto;
    min-width: 0;
  }

  button,
  a {
    white-space: normal;
  }

  .collection-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    min-height: 52px;
    min-width: 120px;
    padding: 10px 14px;
    text-align: center;
  }

  .collection-cta:hover,
  .collection-cta:focus-visible,
  .collection-cta:active {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
    color: ${({ theme }) => theme.colors.primary.BLACK};
    border-color: ${({ theme }) => theme.colors.primary.BLACK};
    box-shadow: none;
    transform: none;
    opacity: 1;
  }

  .collection-cta:hover *,
  .collection-cta:focus-visible *,
  .collection-cta:active * {
    color: ${({ theme }) => theme.colors.primary.BLACK} !important;
  }

  ${media.mobileLg} {
    width: 100%;
  }
`;

export const CollectionCtaContent = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  white-space: normal;
  line-height: 1.1;
  text-align: center;
`;

export const CollectionCtaSubtext = styled.span`
  ${({ theme }) => theme.typography.Body_Medium}
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
`;

export const CollectionBuyButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.SM,
})`
  min-width: 120px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border: none;
  border-radius: 0.75rem;
  box-shadow: none;
  transform: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.BLACK};
    color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    box-shadow: none;
    transform: none;
    opacity: 1;
  }
`;

export const CollectionRentButton = styled(GenericButton).attrs({
  variant: VARIANT.SECONDARY,
  size: SIZE.SM,
})`
  min-width: 120px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  border: none;
  border-radius: 0.75rem;
  box-shadow: none;
  transform: none;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    color: ${({ theme }) => theme.colors.primary.BLACK};
    box-shadow: none;
    transform: none;
    opacity: 1;
  }
`;

export const PassiveActionBlock = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding-left: 10px;
  align-items: stretch;

  > * {
    height: 100%;
  }

  > * > div:last-child {
    margin-top: auto;
  }

  ${media.desktopMd} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const TwoButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;

  > * {
    width: 100%;
    min-width: 0;
  }

  button,
  a {
    white-space: nowrap;
  }

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const MediaTypePill = styled.div`
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: 8px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
`;

export const HeaderSearchArea = styled.div<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  width: ${({ $open }) => ($open ? "260px" : "36px")};
  height: 36px;
  box-sizing: border-box;
  padding: ${({ $open }) => ($open ? "8px 12px" : "8px")};
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid
    ${({ $open, theme }) =>
      $open ? theme.colors.primary.GRAY : theme.colors.neutral.WHITE};
  background: ${({ $open, theme }) =>
    $open ? theme.colors.neutral.OFF_WHITE : theme.colors.neutral.WHITE};
  cursor: ${({ $open }) => ($open ? "text" : "pointer")};
  transition: all 0.25s ease;

  ${media.tablet} {
    width: ${({ $open }) => ($open ? "220px" : "36px")};
  }

  ${media.mobile} {
    width: ${({ $open }) => ($open ? "100%" : "36px")};
  }
`;

export const HeaderSearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  cursor: pointer;
`;

export const HeaderSearchInput = styled.input<{ $open: boolean }>`
  border: none;
  background: transparent;
  outline: none;
  margin-left: ${({ $open }) => ($open ? "8px" : "0")};
  padding: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  width: ${({ $open }) => ($open ? "100%" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: all 0.25s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
`;
