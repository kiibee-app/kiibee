import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";
import Link from "next/link";

export const ViewersLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3.5)};
`;

export const ViewersHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ViewersPanel = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ViewersState = styled.div`
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary.muted};
  ${({ theme }) => theme.typography.Body_Medium};
`;

export const DetailsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.animations.fast};

  &:hover {
    opacity: 0.8;
  }
`;

export const ProfileHero = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(5)};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.neutral.WHITE} 0%,
    ${({ theme }) => theme.colors.neutral.PALE_GREEN} 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
  }
`;

export const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const ProfileAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProfileAvatarFallback = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.GREEN} 0%,
    ${({ theme }) => theme.colors.neutral.DUSTY_TEAL} 100%
  );
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const ProfileName = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
  letter-spacing: -0.02em;
`;

export const ProfileEmail = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;

  ${media.mobileLg} {
    justify-content: center;
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(3)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const StatLabel = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
`;

export const StatValue = styled.span`
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const DetailsTabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  flex-wrap: wrap;
`;

export const DetailsTabButton = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast};

  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.colors.neutral.PALE_GREEN};
          color: ${theme.colors.primary.GREEN_100};
        `
      : css`
          background: transparent;
          color: ${theme.colors.secondary.muted};

          &:hover {
            background: ${theme.colors.neutral.OFF_WHITE};
            color: ${theme.colors.secondary.main};
          }
        `}
`;

export const DetailsSection = styled.section`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const DetailsSectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)}
    ${({ theme }) => theme.spacing(4.5)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const DetailsSectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const DetailsSectionBody = styled.div`
  padding: ${({ theme }) => theme.spacing(4)}
    ${({ theme }) => theme.spacing(4.5)};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(3)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary.main};
  word-break: break-word;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ContentCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  transition: box-shadow ${({ theme }) => theme.animations.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const ContentThumb = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const ContentThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ContentThumbFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

export const ContentBody = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ContentTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
  line-height: 1.4;
`;

export const ContentMeta = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 14px;
`;

export const SubsectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing(5)};
    padding-top: ${({ theme }) => theme.spacing(5)};
    border-top: 1px solid ${({ theme }) => theme.colors.secondary.border};
  }
`;

export const SubsectionTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 14px;
`;
