import { MonoText } from "@/components/UI/Monotext";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const HeaderWrapper = styled.header`
  height: 70px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  min-width: 180px;
`;

export const MobileToggle = styled.button`
  display: none;
  border: none;
  background: transparent;
  padding: 0;
  margin-right: 10px;
  cursor: pointer;

  ${media.tablet} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 42px;

  ${media.tablet} {
    display: none;
  }
`;

export const NavItem = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const Right = styled.div`
  min-width: 180px;
  display: flex;
  justify-content: flex-end;
`;

export const ProfileButton = styled.button`
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gredint.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.H4_SemiBold};
  cursor: pointer;
`;
