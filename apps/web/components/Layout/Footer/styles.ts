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
  font-size: 1.25rem;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 14px;
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
  font-size: 1rem;
  font-weight: 500;
  line-height: normal;
  margin: 6px 0;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  gap: 6px;
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
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding: 30px 60px;

  @media (max-width: 1024px) {
    padding: 25px 40px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  @media (max-width: 640px) {
    padding: 20px;
    font-size: 12px;
    align-items: left;
    text-align: center;
  }
`;

export const BottomLeft = styled.div`
  max-width: 100%;

  @media (max-width: 640px) {
    text-align: center;
  }
`;

export const BottomRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: normal;
  align-items: flex-end;

  @media (max-width: 1024px) {
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

  @media (max-width: 1024px) {
    justify-content: flex-start;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;
    padding: 0;
  }
`;

export const CardWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 1024px) {
    justify-content: flex-start;
  }

  @media (max-width: 640px) {
    justify-content: flex-start;
    width: 100%;
  }
`;
