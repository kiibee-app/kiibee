import styled, { css } from "styled-components";
import { SearchArea } from "@/components/UI/GenericTabs/styles";

export const NavbarSearchArea = styled(SearchArea)`
  align-self: center;
  flex-shrink: 0;
  border-color: ${({ $open, theme }) =>
    $open ? theme.colors.primary.GRAY : "transparent"};
  background: ${({ $open, theme }) =>
    $open ? theme.colors.neutral.OFF_WHITE : "transparent"};

  ${({ $open }) =>
    !$open &&
    css`
      width: auto;
      min-width: 0;
      height: auto;
      padding: 12px 4px 6px;
      border-radius: 0;
      transform: translateY(1px);
    `}

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;
