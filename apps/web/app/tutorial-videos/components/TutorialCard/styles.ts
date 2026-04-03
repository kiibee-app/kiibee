import styled from "styled-components";

export const CardShell = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 38px;
  padding: 1.125rem 1.25rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Media = styled.div`
  position: relative;
  width: 100%;
  padding-top: 60%;
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
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
  border: 1px solid rgba(15, 23, 42, 0.15);
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
  font-size: 1.35rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.6);
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
  color: rgba(15, 23, 42, 0.65);
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FormatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: flex-start;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(243, 244, 246, 0.9);
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  width: 100%;
  border: 1px solid rgba(226, 232, 240, 1);
`;

export const FormatIcon = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.9);
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

export const AccessPill = styled.button`
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.85rem 1rem;
  margin: 1.125rem 1.25rem;
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  text-align: center;
  width: 100%;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  }
`;
