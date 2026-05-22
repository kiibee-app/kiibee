"use client";

import Image, { StaticImageData } from "next/image";
import React, { ReactNode } from "react";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { Card, ImageWrapper, Content, Footer, Badge } from "./styles";

type GenericCardProps = {
  image?: string | StaticImageData;
  alt?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  badgeVariant?: "default" | "owned";
  compact?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  width?: string;
};

function applySoftOutlineToFooterButtons(node: ReactNode): ReactNode {
  if (!React.isValidElement(node)) return node;

  const element = node as React.ReactElement<Record<string, unknown>>;

  if (element.type === GenericButton) {
    return React.cloneElement(element, {
      ...element.props,
      variant: VARIANT.SOFT_OUTLINE,
    });
  }

  if (!element.props?.children) return node;

  return React.cloneElement(element, {
    ...element.props,
    children: React.Children.map(element.props.children as ReactNode, (child) =>
      applySoftOutlineToFooterButtons(child),
    ),
  });
}

export default function GenericCard({
  image,
  alt,
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  compact = false,
  footer,
  children,
  width,
}: GenericCardProps) {
  return (
    <Card $width={width} $compact={compact}>
      {image && (
        <ImageWrapper $compact={compact}>
          {badge && <Badge $variant={badgeVariant}>{badge}</Badge>}
          <Image
            src={image}
            alt={alt || "card image"}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </ImageWrapper>
      )}
      <Content>
        {title}
        {subtitle}
        {children}
      </Content>

      {footer && <Footer>{applySoftOutlineToFooterButtons(footer)}</Footer>}
    </Card>
  );
}
