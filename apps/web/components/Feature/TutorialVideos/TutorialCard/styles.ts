import styled from "styled-components";
import Link from "next/link";
import { MonoText } from "@/components/UI/Monotext";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

export const CardLink = styled(Link)<{ $clickable?: boolean }>`
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 100%;
  width: 100%;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

export const CardTitle = styled(MonoText)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
  min-width: 0;
`;

export const CardCreator = styled(MonoText)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
`;

export const CardShell = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 0.75rem;
  padding: 1.125rem 1.25rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 20px 45px ${({ theme }) => theme.colors.neutral.GRAY_300};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_100};

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 0.75rem;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: min(360px, 100%);

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    min-height: 420px;
    border-radius: 28px;
  }
`;

export const Tag = styled.span`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  box-shadow: 0 8px 16px ${({ theme }) => theme.colors.neutral.OVERLAY};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 100%;
  padding-top: 1.25rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const MetaItem = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const MetaDate = styled.span`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 25 / 19;
  overflow: hidden;
  border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
`;

export const VideoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.313rem;
  box-sizing: border-box;
  width: 100%;
  height: ${GENERIC_CARD_LAYOUT.ACTION_HEIGHT};
  min-height: ${GENERIC_CARD_LAYOUT.ACTION_HEIGHT};
  flex-shrink: 0;
  padding: 0 12px;
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: ${({ theme }) => theme.radius.md};

  span {
    font-size: ${GENERIC_CARD_LAYOUT.ACTION_FONT_SIZE};
    font-weight: ${GENERIC_CARD_LAYOUT.ACTION_FONT_WEIGHT};
    line-height: 1;
  }
`;

export const VideoLabel = styled.span`
  font-size: 0.688rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ActionRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;

  > * {
    flex: 1 0 auto;
    min-width: 0;
  }
`;
