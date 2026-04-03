import styled from "styled-components";

export const Card = styled.article`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 420px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.15);
  border: 1px solid rgba(15, 23, 42, 0.08);
`;

export const Media = styled.div`
  position: relative;
  width: 100%;
  padding-top: 60%;
  background-size: cover;
  background-position: center;
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
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
`;

export const Content = styled.div`
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100%;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
`;

interface MetaItemProps {
  $isMuted?: boolean;
}

export const MetaItem = styled.span<MetaItemProps>`
  color: ${({ theme, $isMuted }) =>
    $isMuted ? "rgba(15, 23, 42, 0.55)" : theme.colors.primary.BLACK};
  font-weight: ${({ $isMuted }) => ($isMuted ? 500 : 600)};
`;

export const Description = styled.p`
  margin: 0;
  color: rgba(15, 23, 42, 0.7);
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const FormatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const AccessPill = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
