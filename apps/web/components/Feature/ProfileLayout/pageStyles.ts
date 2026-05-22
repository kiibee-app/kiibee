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
  width: 38px;
  height: 38px;
  overflow: hidden;
  border-radius: 10px;
  flex: 0 0 auto;
  box-shadow: 0 8px 18px ${({ theme }) => theme.colors.neutral.GRAY_300};
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
