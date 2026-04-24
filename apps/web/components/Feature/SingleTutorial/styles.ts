import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  max-width: 1220px;
  min-height: 100vh;
  height: auto;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 7rem 1.5rem 4rem;

  ${media.tablet} {
    padding: 6rem 1rem 3rem;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

export const BackButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 34px;
  padding: 5px 20px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  cursor: pointer;
`;

export const ShareText = styled.span`
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const Hero = styled.div`
  position: relative;
  width: min(920px, 78%);
  aspect-ratio: 90 / 49;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2.25rem;
  margin-left: auto;
  margin-right: auto;

  ${media.tablet} {
    width: 100%;
  }
`;

export const Preview = styled.div`
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HeroTag = styled.span`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 2;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeroTagText = styled.span`
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const HeroVideoTag = styled.span`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeroVideoText = styled.span`
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const TrailerButton = styled.button`
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0.65rem 1rem;
  cursor: pointer;

  ${media.tablet} {
    right: 1rem;
    bottom: 1rem;
  }
`;

export const TrailerText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const ContentShell = styled.div`
  width: 100%;
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.8rem;
`;

export const BrandLogo = styled.span`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;

  img {
    object-fit: cover;
  }
`;

export const BrandText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const HeadingBlock = styled.div`
  margin-bottom: 2.2rem;
`;

export const MainTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Heading2}
  font-size: 40px;
  font-weight: 600;
  line-height: normal;

  ${media.tablet} {
    font-size: 30px;
  }
`;

export const BodyTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 760px;
  margin-top: 1.5rem;
`;

export const DescriptionText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.8rem;
`;

export const InfoTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 8px 16px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const InfoTagText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
`;

export const MainAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 51px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  cursor: pointer;
  margin-bottom: 2rem;
`;

export const MainActionText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const MetaSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  padding-top: 1.5rem;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MetaKey = styled.span`
  width: 95px;
`;

export const MetaLabelText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  ${({ theme }) => theme.typography.Body_Regular}
`;

export const MetaValueText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
`;

export const Card = styled.article`
  width: 100%;

  ${media.tablet} {
    margin-top: 0.5rem;
  }
`;

export const CollectionSection = styled.section`
  margin-top: 2.5rem;
`;

export const CollectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const CollectionLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  }
`;

export const CollectionTitleGroup = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
`;

export const CollectionSectionTitle = styled.span`
  ${({ theme }) => theme.typography.Body_Medium}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CollectionStrip = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CollectionCard = styled.article`
  display: flex;
  width: 290px;
  min-width: 290px;
  height: 400px;
  padding: 18px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: 0 4px 16px 0 ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const CollectionImageArea = styled.div`
  position: relative;
  display: flex;
  height: 190px;
  padding: 17px 152px 149px 19px;
  align-items: center;
  align-self: stretch;
  aspect-ratio: 25 / 19;
  border-radius: 12px 12px 0 0;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200} 50% / cover
    no-repeat;
  overflow: hidden;
  box-sizing: border-box;

  img {
    object-fit: cover;
  }
`;

export const CollectionBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: 0 1px 2px ${({ theme }) => theme.colors.neutral.OVERLAY};
  z-index: 2;
`;

export const CollectionBadgeText = styled.span`
  ${({ theme }) => theme.typography.Body_Bold}
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const CollectionCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  width: 250px;
`;

export const CollectionTitle = styled.h3`
  margin: 0;
  height: 24px;
  align-self: stretch;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.typography.H5_Medium}
  font-weight: 500;
  line-height: normal;
`;

export const CollectionAuthor = styled.p`
  margin: 0;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium}
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
`;

export const CollectionTime = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  ${({ theme }) => theme.typography.Body_Medium}
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
`;

export const CollectionVideoPill = styled.div`
  width: 250px;
  height: 36px;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CollectionVideoIconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  flex-shrink: 0;
`;

export const CollectionVideoLabelText = styled.span`
  ${({ theme }) => theme.typography.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CollectionActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  align-self: stretch;
  margin-top: auto;
`;

export const CollectionFreeButton = styled.a`
  display: flex;
  width: 250px;
  height: 33px;
  padding: 13px 112px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  border: 1.3px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Bold}
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  box-sizing: border-box;
  text-decoration: none;
`;
