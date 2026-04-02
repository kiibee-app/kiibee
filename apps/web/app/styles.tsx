"use client";

import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
export const Footer = styled.footer`
  display: flex;
`;
