"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import {
  AvatarFrame,
  AvatarText,
  Description,
  Dropdown,
  HamburgerButton,
  HeaderLeft,
  HeaderRight,
  HeaderRoot,
  HeaderUser,
  MenuButton,
  MenuWrap,
  Title,
} from "./styles";

interface HeaderProps {
  title: string;
  description: string;
  onToggleSidebar?: () => void;
}

type StoredAuthPayload = {
  fullName?: string;
};

export function Header({ title, description, onToggleSidebar }: HeaderProps) {
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
    localStorage.removeItem("admin.authPayload");
    document.cookie = "adminLoggedIn=; Path=/; Max-Age=0; SameSite=Lax";
    setOpen(false);
    router.push("/login");
  };

  const handleProfile = () => {
    setOpen(false);
    router.push("/profile");
  };

  const displayName =
    typeof window === "undefined"
      ? "Admin"
      : (() => {
          const fromStorage = window.localStorage.getItem("admin.authPayload");
          if (!fromStorage) return "Admin";

          try {
            const parsed = JSON.parse(fromStorage) as StoredAuthPayload;
            return parsed.fullName?.trim() || "Admin";
          } catch {
            return "Admin";
          }
        })();

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <HeaderRoot>
      <HeaderLeft>
        <HamburgerButton
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </HamburgerButton>
        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>
      </HeaderLeft>
      <HeaderRight>
        <HeaderUser>{displayName}</HeaderUser>
        <MenuWrap ref={menuRef}>
          <AvatarFrame type="button" onClick={() => setOpen((prev) => !prev)}>
            <AvatarText aria-hidden>{initials}</AvatarText>
          </AvatarFrame>
          {open ? (
            <Dropdown>
              <MenuButton type="button" onClick={handleProfile}>
                Profile
              </MenuButton>
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
