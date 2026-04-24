"use client";

import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { typography } from "@repo/ui/typography";

export const Hero = styled.section<{ $backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${({ $backgroundImage }) => $backgroundImage});
  background-size: cover;
  background-position: center;
  font-family: ${({ theme }) => theme.typography.Heading1.fontFamily};
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gredint.CARD_SHADOW};
`;

export const Container = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 850px;
  padding: 0 20px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.Heading2};
  margin: 0 0 20px 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;
  font-family: ${typography.Heading2.fontFamily};
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 600;
  line-height: normal;
  text-shadow: 0 2px 8px ${({ theme }) => theme.colors.gredint.CARD_BG};
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.H4_Medium};
  margin: 0 0 35px 0;
  max-width: 750px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;
  font-family: ${typography.H4_Medium.fontFamily};
  font-style: ${typography.H4_Medium.fontStyle};
  font-weight: 500;
  line-height: normal;
  text-shadow: 0 1px 6px ${({ theme }) => theme.colors.gredint.BLACK_90};
`;

export const PrimaryButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.LG,
})`
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};
`;
