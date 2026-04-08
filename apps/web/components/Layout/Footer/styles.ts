import Link from "next/link";
import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Container = styled.footer`
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  color: ${({ theme }) => theme.colors.primary.WHITE};
`;
export const Top = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 60px;
  align-items: flex-start;
  padding: 70px 60px 30px;
  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 50px 30px 20px;
  }
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Title = styled.h4`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 14px;
`;
export const LogoRow = styled.div`
  margin-bottom: 18px;
  padding-left: 6rem;
  img {
    width: 90px;
    height: auto;
  }
  ${media.tablet} {
    padding-left: 0;
  }
`;
export const IconRow = styled.div`
  display: flex;
  gap: 12px;
  padding-left: 6rem;
  ${media.tablet} {
    padding-left: 0;
  }
`;
export const LinkItem = styled(Link)`
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  margin: 6px 0;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;
export const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;
export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 30px 60px;
  ${media.tablet} {
    flex-direction: column;
    align-items: flex-start;
    padding: 25px 30px;
  }
`;
export const BottomLeft = styled.div`
  max-width: 100%;
`;
export const BottomRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  align-items: flex-end;
  ${media.tablet} {
    align-items: flex-start;
  }
`;
export const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  span {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
  span::before {
    content: "•";
    margin-right: 8px;
  }
`;
export const CardWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  img {
    height: 28px;
    width: auto;
  }
`;
