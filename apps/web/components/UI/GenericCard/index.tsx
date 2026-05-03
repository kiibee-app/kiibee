"use client";

import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Card, ImageWrapper, Content, Footer, Badge } from "./styles";

type GenericCardProps = {
  image?: string | StaticImageData;
  alt?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  /** "owned" = teal pill (e.g. purchased collections) */
  badgeVariant?: "default" | "owned";
  /** Dense layout for horizontal strips (e.g. inside collection cards) */
  compact?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  width?: string;
};

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

      {footer && <Footer>{footer}</Footer>}
    </Card>
  );
}
