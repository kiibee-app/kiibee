import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

export const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  min-width: 0;
`;

export const BrandAvatar = styled.span`
  position: relative;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 8px;
  flex: 0 0 auto;
`;

export const BrandAvatarImage = styled(Image)`
  object-fit: cover;
`;

export const BrandName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
`;
