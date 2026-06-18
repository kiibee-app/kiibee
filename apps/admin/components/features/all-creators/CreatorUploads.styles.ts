import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) =>
    theme.colors.primary.GREEN_100 || theme.colors.primary.GREEN};
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 0;
  transition:
    opacity 0.2s,
    transform 0.2s;

  &:hover {
    opacity: 0.8;
    transform: translateX(-2px);
  }
`;

export const UploadsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const UploadCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  align-items: center;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${media.mobileLg} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const UploadThumbnail = styled.img`
  width: 96px;
  height: 54px;
  object-fit: cover;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  flex-shrink: 0;

  ${media.mobileLg} {
    width: 100%;
    height: 120px;
  }
`;

export const UploadThumbnailPlaceholder = styled.div`
  width: 96px;
  height: 54px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  flex-shrink: 0;

  ${media.mobileLg} {
    width: 100%;
    height: 120px;
  }
`;

export const UploadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  width: 100%;
`;

export const UploadTitle = styled.h6`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
  line-height: 1.4;
`;

export const UploadMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const UploadBadge = styled.span<{
  $type?: "free" | "paid" | "draft" | "public";
}>`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;

  ${({ $type, theme }) => {
    if ($type === "free" || $type === "public") {
      return css`
        background: ${theme.colors.neutral.PALE_GREEN};
        color: ${theme.colors.primary.GREEN_100};
      `;
    }
    if ($type === "draft") {
      return css`
        background: ${theme.colors.neutral.GRAY_100};
        color: ${theme.colors.secondary.muted};
      `;
    }
    return css`
      background: ${theme.colors.primary.WHITE};
      color: ${theme.colors.primary.ORANGE};
      border: 1px solid ${theme.colors.primary.ORANGE};
    `;
  }}
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DetailHeaderCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const DetailMediaWrapper = styled.div`
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const DetailThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DetailTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
  line-height: 1.4;
`;

export const DetailDescription = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary.muted};
  white-space: pre-wrap;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const PlaceholderVideoIcon = styled.div`
  opacity: 0.3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const AssetLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.BLUE};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatusMessage = styled.div<{
  $variant?: "loading" | "error" | "empty";
}>`
  padding: 30px 0;
  text-align: center;
  font-weight: ${({ $variant }) => ($variant === "empty" ? 400 : 500)};
  color: ${({ $variant, theme }) => {
    if ($variant === "error") return theme.colors.secondary.RED;
    if ($variant === "empty") return theme.colors.secondary.muted;
    return theme.colors.secondary.main;
  }};
`;

export const ContentTypeLabel = styled.span`
  text-transform: capitalize;
`;
