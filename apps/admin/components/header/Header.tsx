"use client";

import styled from "styled-components";

const HeaderRoot = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.bg.white};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.main};
`;

const Description = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const HeaderUser = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.main};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarFrame = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  padding: 2px;
  background: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid #ffffff;
`;

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <HeaderRoot>
      <HeaderLeft>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </HeaderLeft>
      <HeaderRight>
        <HeaderUser>Young Alaska</HeaderUser>
        <AvatarFrame>
          <AvatarImage src="/images/avater.avif" alt="User avatar" />
        </AvatarFrame>
      </HeaderRight>
    </HeaderRoot>
  );
}
