import Link from "next/link";
import styled from "styled-components";

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

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 60px 40px 20px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 40px 20px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 15px;
  }
`;

export const LogoRow = styled.div`
  margin-bottom: 18px;
  padding-left: 6rem;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

export const IconRow = styled.div`
  display: flex;
  gap: 12px;
  padding-left: 6rem;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

export const LinkItem = styled(Link)`
  display: inline-block;
  opacity: 0.75;
  font-size: 14px;
  margin: 6px 0;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    opacity: 1;
  }
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

  font-size: 13px;
  opacity: 0.75;

  padding: 30px 60px;

  @media (max-width: 1024px) {
    padding: 25px 40px;
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 640px) {
    padding: 20px;
    font-size: 12px;
  }
`;

export const BottomLeft = styled.div`
  max-width: 100%;
`;

export const BottomRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
`;

export const LinkRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;

  a {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    opacity: 0.75;

    &:hover {
      opacity: 1;
    }
  }

  a:not(:first-child)::before {
    content: "•";
    margin-right: 12px;
    opacity: 0.5;
  }
`;

export const CardWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;
