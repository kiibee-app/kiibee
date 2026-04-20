"use client";

import { VARIANT, Variant } from "@/utils/Constants";
import React from "react";
import { ButtonEl, AnchorEl } from "./styles";
import type { ButtonSize } from "./styles";

type ButtonOrAnchorProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface GenericButtonProps extends ButtonOrAnchorProps {
  variant?: Variant;
  size?: ButtonSize;
  fullWidth?: boolean;
  minWidth?: string;
  isLoading?: boolean;
  asAnchor?: boolean;
  href?: string;
}

export default function GenericButton({
  variant = VARIANT.PRIMARY,
  size = "md",
  fullWidth = false,
  minWidth,
  isLoading = false,
  asAnchor = false,
  href,
  children,
  ...rest
}: React.PropsWithChildren<GenericButtonProps>) {
  if (asAnchor || href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <AnchorEl
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $minWidth={minWidth}
        {...anchorProps}
        aria-disabled={isLoading || anchorProps["aria-disabled"]}
        href={isLoading ? undefined : href}
      >
        {isLoading ? "Loading..." : children}
      </AnchorEl>
    );
  }

  return (
    <ButtonEl
      type="button"
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $minWidth={minWidth}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      disabled={isLoading || rest.disabled}
    >
      {isLoading ? "Loading..." : children}
    </ButtonEl>
  );
}
