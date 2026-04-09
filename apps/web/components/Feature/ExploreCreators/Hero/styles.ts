import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Hero = styled.section`
  width: 100%;
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
`;

export const Inner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const Title = styled.h1`
  text-align: center;
`;

export const Controls = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;

  ${media.mobile} {
    flex-wrap: nowrap;
  }
`;

export const FilterBtn = styled.div`
  max-height: 50px;
  padding: 0px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme?.colors.neutral.OFF_WHITE};
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  gap: 2px;

  ${media.tablet} {
    flex: 0 0 120px;
  }
`;

export const SortBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 20px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  width: 100%;
  max-width: 200px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
`;

export const DropdownItem = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const Text = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
