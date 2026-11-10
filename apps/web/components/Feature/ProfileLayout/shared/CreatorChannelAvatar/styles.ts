import styled from "styled-components";
import Image from "next/image";

export type AvatarFit = "cover" | "contain";

export const AvatarImage = styled(Image)<{ $fit: AvatarFit }>`
  object-fit: ${({ $fit }) => $fit};
  object-position: center;
  width: 100%;
  height: 100%;
  background: transparent;
`;
