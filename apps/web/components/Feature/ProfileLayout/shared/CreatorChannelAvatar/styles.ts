import styled, { css } from "styled-components";
import Image from "next/image";
import { MonoText } from "@/components/UI/Monotext";

export type AvatarFit = "cover" | "contain";

const fitStyles = css<{ $fit: AvatarFit }>`
  object-fit: ${({ $fit }) => $fit};
  object-position: center;
  width: 100%;
  height: 100%;
  ${({ $fit }) =>
    $fit === "contain" &&
    css`
      padding: 14% 8%;
      box-sizing: border-box;
    `}
`;

export const AvatarImage = styled(Image)<{ $fit: AvatarFit }>`
  ${fitStyles}
`;

export const RemoteAvatarImage = styled.img<{ $fit: AvatarFit }>`
  ${fitStyles}
`;

export const AvatarInitial = styled(MonoText)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  user-select: none;
`;
