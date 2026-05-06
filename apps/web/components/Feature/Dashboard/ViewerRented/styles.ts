import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  padding-left: 10px;
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

export const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: 16px;
  padding-left: 10px;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  align-items: stretch;

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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
  padding-left: 10px;
  align-items: stretch;

  > * {
    height: 100%;
  }

  > * > div:last-child {
    margin-top: auto;
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
