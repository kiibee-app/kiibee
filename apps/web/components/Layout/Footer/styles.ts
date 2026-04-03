import styled from "styled-components";

export const Container = styled.footer`
  background: #0b3d2e;
  color: white;
  padding: 60px 40px 30px;
`;

export const Top = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h4 {
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

export const Logo = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;

export const LinkItem = styled.p`
  opacity: 0.8;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export const Bottom = styled.div`
  text-align: center;
  font-size: 14px;
  opacity: 0.6;
`;
