"use client";

import { Variant } from "@/utils/Constants";
import React from "react";
import { ButtonEl, AnchorEl } from "./styles";

type ButtonOrAnchorProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface GenericButtonProps extends ButtonOrAnchorProps {
  variant?: Variant;
  asAnchor?: boolean;
  href?: string;
}

export default function GenericButton({
  variant = "primary",
  asAnchor = false,
  href,
  children,
  ...rest
}: React.PropsWithChildren<GenericButtonProps>) {
  if (asAnchor || href) {
    return (
      <AnchorEl
        $variant={variant}
        href={href}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </AnchorEl>
    );
  }

  return (
    <ButtonEl
      type="button"
      $variant={variant}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </ButtonEl>
  );
}
