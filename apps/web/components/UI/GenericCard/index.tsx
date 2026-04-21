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
  footer,
  children,
  width,
}: GenericCardProps) {
  return (
    <Card $width={width}>
      {image && (
        <ImageWrapper>
          {badge && <Badge>{badge}</Badge>}
          <Image
            src={image}
            alt={alt || "card image"}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
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
