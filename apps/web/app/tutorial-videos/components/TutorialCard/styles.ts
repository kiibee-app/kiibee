import styled from "styled-components";

export const CardShell = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 38px;
  padding: 1.125rem 1.25rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 20px 45px ${({ theme }) => theme.colors.neutral.OVERLAY};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_100};

  @media (max-width: ${({ theme }) => theme.media.sm}) {
    padding: 0.75rem;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 460px;
  width: min(360px, 100%);

  @media (max-width: ${({ theme }) => theme.media.sm}) {
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
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

interface MetaItemProps {
  $isMuted?: boolean;
}

export const MetaItem = styled.span<MetaItemProps>`
  color: ${({ theme, $isMuted }) =>
    $isMuted ? theme.colors.primary.BLACK_90 : theme.colors.primary.BLACK};
  font-weight: ${({ $isMuted }) => ($isMuted ? 500 : 600)};
`;

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
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
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const FormatIcon = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
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
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  text-align: center;
  width: 100%;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.neutral.OVERLAY};
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px ${({ theme }) => theme.colors.neutral.OVERLAY};
  }
`;
