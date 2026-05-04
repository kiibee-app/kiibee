import { media } from "@repo/ui/breakpoints";
import NextImage from "next/image";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  width: 100%;
`;

export const PageWrap = styled.div`
  padding: 40px 30px;

  ${media.tablet} {
    padding: 20px;
  }
`;

export const SearchSlot = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  min-width: min(280px, 100%);
`;

export const SectionBlock = styled.section`
  margin-top: 35px;

  &:first-of-type {
    margin-top: 24px;
  }
`;

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  cursor: default;
`;

export const SectionTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
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
  gap: 10px;
  overflow-x: auto;
  padding: 10px 10px;
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
  box-shadow: ${({ theme }) => theme.shadows.md};

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
  background: ${({ theme }) => theme.colors.primary.GREEN_50};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  ${({ theme }) => theme.typography.Body_Bold};
  font-size: 11px;
  line-height: 1.2;
`;

export const CollectionBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
  align-self: stretch;
`;

export const CollectionMetaTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  gap: 3px;
  align-self: flex-start;
  padding: 5px 12px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const CollectionIconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;
`;
