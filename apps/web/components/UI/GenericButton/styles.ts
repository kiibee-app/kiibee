import styled, { css } from "styled-components";
import type { Variant } from "@/utils/Constants";

export const shared = css<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 120ms ease;

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return css`
          background: #000;
          color: #fff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
          &:hover {
            transform: translateY(-1px);
            opacity: 0.98;
          }
        `;

      case "primary-lite":
        return css`
          background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
          color: ${({ theme }) => theme.colors.primary.BLACK};
          border: 1px solid transparent;
          border-radius: 0.5rem;
          &:hover {
            background: transparent;
            border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
            opacity: 1;
          }
        `;

      default:
        return css`
          background: transparent;
          color: #111;
          border: 1px solid rgba(0, 0, 0, 0.12);
          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }
        `;
    }
  }}
`;

export const ButtonEl = styled.button<{ $variant: Variant }>`
  ${shared}
`;

export const AnchorEl = styled.a<{ $variant: Variant }>`
  ${shared}
`;
