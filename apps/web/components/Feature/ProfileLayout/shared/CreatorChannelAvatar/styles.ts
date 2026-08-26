import styled, { css } from "styled-components";
import Image from "next/image";
import { MonoText } from "@/components/UI/Monotext";

export type AvatarFit = "cover" | "contain";

const fitStyles = css<{ $fit: AvatarFit }>`
  object-fit: ${({ $fit }) => $fit};
  object-position: center;
  width: 100%;
  height: 100%;
  background: transparent;
`;

export const AvatarImage = styled(Image)<{ $fit: AvatarFit }>`
  ${fitStyles}
`;

export const RemoteAvatarImage = styled.img<{ $fit: AvatarFit }>`
  position: absolute;
  inset: 0;
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
  line-height: 1;
  padding: 1px;
`;
