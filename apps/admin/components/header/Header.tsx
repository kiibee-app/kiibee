"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { apiClient, useAdminProfile } from "../../hooks/api";
import { API_ENDPOINTS } from "../../utils/constants";
import { clearTokens, getAccessToken } from "../../utils/token";
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

export function Header({ title, description, onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const profileQuery = useAdminProfile();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setOpen(false);

    try {
      if (getAccessToken()) {
        await apiClient(API_ENDPOINTS.LOGOUT, {
          method: "POST",
        });
      }
    } finally {
      clearTokens();
      router.replace("/login");
    }
  };

  const handleProfile = () => {
    setOpen(false);
    router.push("/profile");
  };

  const displayName =
    profileQuery.data?.fullName?.trim() ||
    [profileQuery.data?.firstName, profileQuery.data?.lastName]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ") ||
    (profileQuery.data?.email.includes("@")
      ? profileQuery.data.email.split("@")[0]
      : undefined) ||
    "Admin";

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
              <MenuButton
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                Logout
              </MenuButton>
            </Dropdown>
          ) : null}
        </MenuWrap>
      </HeaderRight>
    </HeaderRoot>
  );
}
