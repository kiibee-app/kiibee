import { media } from "@repo/ui/breakpoints";
import NextImage from "next/image";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const CARD_SHADOW_COLLECTION =
  "0px 4px 16px rgba(0, 0, 0, 0.08)" as const;

/* ——— Purchased page header ——— */

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  width: 100%;
`;

export const SearchSlot = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  min-width: min(280px, 100%);
`;

/* ——— Section chrome ——— */

export const SectionBlock = styled.section`
  margin-top: 28px;

  &:first-of-type {
    margin-top: 24px;
  }
`;

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  cursor: default;
`;

export const SectionTitle = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const SectionChevron = styled.span`
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  line-height: 1;
`;

export const CollectionsList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 16px;
  width: 100%;

  ${media.tablet} {
    gap: 12px;
  }

  ${media.mobileLg} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CollectionCardSlot = styled.div`
  flex: 1 1 340px;
  max-width: 495px;
  min-width: 0;
  width: 100%;

  ${media.mobileLg} {
    flex: 1 1 auto;
    max-width: 100%;
  }
`;

export const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

export const MediaRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x proximity;
`;

export const MediaRowSlot = styled.div`
  flex: 0 0 auto;
  width: min(320px, 88vw);
  scroll-snap-align: start;
`;

export const EmptyHint = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  display: block;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

/* ——— Collection card ——— */

export const CollectionRoot = styled.article`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-wrap: nowrap;
  gap: 7px;
  width: 100%;
  min-height: 236px;
  padding: 15px 20px 18px 20px;
  box-sizing: border-box;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  box-shadow: ${CARD_SHADOW_COLLECTION};

  ${media.mobileLg} {
    flex-direction: column;
    flex-wrap: wrap;
    min-height: 0;
  }
`;

export const CollectionThumbWrap = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 204px;
  min-height: 204px;
  border-radius: 12px;
  overflow: hidden;
  align-self: stretch;

  ${media.tablet} {
    width: min(204px, 40vw);
    min-height: min(204px, 40vw);
  }

  ${media.mobileLg} {
    width: 100%;
    min-height: 0;
    aspect-ratio: 1;
    max-height: 280px;
  }
`;

export const CollectionCoverImage = styled(NextImage)`
  object-fit: cover;
`;

export const CollectionOwnedBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  ${({ theme }) => theme.typography.Body_Bold};
  font-size: 11px;
  line-height: 1.2;
`;

export const CollectionBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  min-height: 0;
  align-self: stretch;
`;

export const CollectionMetaTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const CollectionFlexSpacer = styled.div`
  flex: 1;
  min-height: 4px;
`;

export const CollectionBottomBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`;

export const CollectionElementsPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 7px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const CollectionIconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;
`;
