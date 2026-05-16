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
  padding: 18px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};

  ${media.tablet} {
    padding: 18px 16px;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;

  ${media.tablet} {
    padding-left: 0;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  ${media.tablet} {
    position: absolute;
    right: 16px;
  }
`;

export const Divider = styled.span`
  width: 1px;
  height: 54px;
  background: ${({ theme }) => theme.colors.primary.GRAY};

  ${media.tablet} {
    display: none;
  }
`;

export const EmailWrapper = styled.div`
  margin-right: 10px;

  ${media.tablet} {
    display: none;
  }
`;

export const ProfileCircle = styled.div`
  width: 48px;
  height: 48px;
  padding: 9px 18px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.gredint.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InitialAvatar = styled(MonoText).attrs({
  $use: "H4_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const LogoButton = styled.button`
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;
export const ChannelText = styled(MonoText)`
  ${media.tablet} {
    display: none;
  }
`;
