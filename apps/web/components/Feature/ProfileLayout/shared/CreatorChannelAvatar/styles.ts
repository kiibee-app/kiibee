import styled from "styled-components";
import Image from "next/image";
import { MonoText } from "@/components/UI/Monotext";

export const AvatarImage = styled(Image)`
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

export const RemoteAvatarImage = styled.img`
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
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
