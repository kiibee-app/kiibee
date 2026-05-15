import styled from "styled-components";
import Image from "next/image";
import { MonoText } from "@/components/UI/Monotext";

export const HeroWrapper = styled.section`
  width: 100%;
  margin-top: 60px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const CoverFrame = styled.div`
  position: relative;
  width: 100%;
  height: 290px;
  overflow: hidden;

  ${({ theme }) => theme.media.desktopSm} {
    height: 250px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    height: 210px;
  }
`;

export const CoverImage = styled(Image)`
  object-fit: cover;
  object-position: center;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 16px 36px;
`;

export const AvatarWrap = styled.div`
  position: relative;
  width: 170px;
  height: 170px;
  margin-top: -82px;
  border-radius: 999px;
  overflow: hidden;

  ${({ theme }) => theme.media.mobileMd} {
    width: 136px;
    height: 136px;
    margin-top: -66px;
    border-width: 6px;
  }
`;

export const AvatarImage = styled(Image)`
  object-fit: cover;
`;

export const NameText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Heading2",
  color: theme.colors.primary.BLACK,
}))`
  margin-top: 22px;
`;

export const UploadsText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))`
  margin-top: 8px;
`;

export const BioText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))`
  margin-top: 10px;
  max-width: 540px;
`;
