import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { ProfileHero } from "../viewers/Viewers.styles";

export const CreatorProfileHero = styled(ProfileHero)`
  grid-template-columns: auto minmax(0, 1fr) auto;

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const CloseAccountButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease;

  &:hover:not(:disabled) {
    background: #fee2e2;
    border-color: #fca5a5;
  }

  &:focus-visible {
    outline: 2px solid #b91c1c;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${media.mobileLg} {
    justify-self: center;
  }
`;
