import styled, { css } from "styled-components";
import type { CreatorStatus } from "../../../types/creator-request";

export const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  cursor: pointer;

  &:hover td {
    background: ${({ theme }) => theme.colors.bg.app};
  }
`;

export const Th = styled.th`
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.main};
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.muted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CreatorCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.text.main};
  font-weight: 600;
`;

export const MiniText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ $status: CreatorStatus }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  ${({ $status, theme }) => {
    if ($status === "approved") {
      return css`
        background: ${theme.colors.brand.lightest};
        color: ${theme.colors.brand.dark};
      `;
    }

    if ($status === "rejected") {
      return css`
        background: ${theme.colors.bg.browser};
        color: ${theme.colors.text.main};
      `;
    }

    return css`
      background: ${theme.colors.brand.lightest};
      color: ${theme.colors.brand.dark};
    `;
  }}
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button<{ $variant: "approve" | "reject" }>`
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  padding: 8px 14px;
  cursor: pointer;

  ${({ $variant, theme }) => {
    if ($variant === "approve") {
      return css`
        border: 1px solid ${theme.colors.brand.light};
        background: ${theme.colors.brand.light};
        color: ${theme.colors.bg.white};
      `;
    }

    return css`
      border: 1px solid ${theme.colors.text.main};
      background: ${theme.colors.text.main};
      color: ${theme.colors.bg.white};
    `;
  }}
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.brand.light : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.brand.lightest : theme.colors.bg.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.brand.dark : theme.colors.text.muted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Ellipsis = styled.span`
  min-width: 24px;
  text-align: center;
`;

export const PageSize = styled.select`
  min-width: 90px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg.white};
  color: ${({ theme }) => theme.colors.text.muted};
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.main};
  word-break: break-word;
`;

export const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.brand.dark};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
