import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";

export const Section = styled.section`
  width: 100%;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 80px 20px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const Heading = styled.h2`
  margin: 0 0 45px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: center;
  font-family: ${typography.Heading2.fontFamily};
  font-size: 40px;
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 600;
  line-height: normal;

  ${media.tablet} {
    font-size: 34px;
  }
`;

export const List = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Item = styled.button`
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  text-align: left;
`;

export const Question = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-family: ${typography.H4_Medium.fontFamily};
  font-size: 22px;
  font-style: ${typography.H4_Medium.fontStyle};
  font-weight: 400;
  line-height: normal;
`;

export const AnswerGrid = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows ${({ theme }) => theme.animations.normal};
`;

export const AnswerInner = styled.div`
  overflow: hidden;
`;

export const Answer = styled.p<{ $open: boolean }>`
  margin: 0;
  padding-top: 12px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-family: ${typography.Body_Regular.fontFamily};
  font-size: 15px;
  font-style: ${typography.Body_Regular.fontStyle};
  font-weight: 400;
  line-height: 1.5;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.animations.normal};
`;
