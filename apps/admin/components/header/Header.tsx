"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

const AvatarFrame = styled.button`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  padding: 2px;
  background: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid #ffffff;
`;

const MenuWrap = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 140px;
  background: ${({ theme }) => theme.colors.bg.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  padding: 6px;
  z-index: 30;
`;

const MenuButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.main};
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.lightest};
  }
`;

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    document.cookie = "adminLoggedIn=; Path=/; Max-Age=0; SameSite=Lax";
    setOpen(false);
    router.push("/login");
  };

  return (
    <HeaderRoot>
      <HeaderLeft>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </HeaderLeft>
      <HeaderRight>
        <HeaderUser>Young Alaska</HeaderUser>
        <MenuWrap ref={menuRef}>
          <AvatarFrame type="button" onClick={() => setOpen((prev) => !prev)}>
            <AvatarImage src="/images/avater.avif" alt="User avatar" />
          </AvatarFrame>
          {open ? (
            <Dropdown>
              <MenuButton type="button" onClick={handleLogout}>
                Logout
              </MenuButton>
            </Dropdown>
          ) : null}
        </MenuWrap>
      </HeaderRight>
    </HeaderRoot>
  );
}
