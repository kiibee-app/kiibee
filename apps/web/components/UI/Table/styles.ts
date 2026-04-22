import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 8px;
  overflow-x: auto;

  ${media.tablet} {
    background: transparent;
    border: none;
    box-shadow: none;
  }
`;

export const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;

  ${media.tablet} {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export const DesktopHeaderRow = styled.tr`
  background: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.tablet} {
    display: none;
  }
`;

export const DesktopRow = styled.tr`
  transition: background 0.2s ease;

  ${media.tablet} {
    display: none;
  }
`;

export const TableHead = styled.th`
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;

export const TableCell = styled.td`
  padding: 16px 12px;
  text-align: left;

  ${media.tablet} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 6px 0;
    border-bottom: none;
  }
`;

export const MobileRow = styled.div<{ $isOpen?: boolean }>`
  display: none;

  ${media.tablet} {
    display: block;
    width: 100%;
    border-radius: 10px;
    margin-bottom: 10px;
    background: ${({ theme }) => theme.colors.primary.WHITE};
    overflow: hidden;
    transition: all 0.3s ease;
  }
`;

export const MobileHeader = styled.div`
  display: none;

  ${media.tablet} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    cursor: pointer;
  }
`;

export const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
  padding: ${({ $isOpen }) => ($isOpen ? "8px 16px" : "0 16px")};
`;

export const HeaderLabel = styled.span`
  flex: 1;
  display: none;

  ${media.tablet} {
    display: inline-block;
  }
`;

export const ValueText = styled.span`
  flex: 2;
  text-align: right;
`;

export const NoDataCell = styled.td`
  text-align: center;
  padding: 30px;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
