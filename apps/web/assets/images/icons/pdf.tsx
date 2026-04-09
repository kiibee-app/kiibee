import type { SVGProps } from "react";
import React from "react";
import { COLORS } from "@repo/ui/colors";
import { ICON_SVG_PROP_NAMES, SVG_XMLNS } from "@/utils/Constants";

type PdfIconBaseProps = Omit<
  SVGProps<SVGSVGElement>,
  (typeof ICON_SVG_PROP_NAMES)[number]
>;

export interface PdfIconProps extends PdfIconBaseProps {
  width?: number;
  height?: number;
  color?: string;
}

export const PdfIcon: React.FC<PdfIconProps> = ({
  width = 16,
  height = 18,
  color,
  className,
  ...rest
}) => {
  const iconColor = color ?? COLORS.primary.BLACK;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 18"
      fill="none"
      xmlns={SVG_XMLNS}
      className={className}
      aria-label="PDF"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1.8C0 1.32261 0.189642 0.864773 0.527208 0.527208C0.864773 0.189642 1.32261 0 1.8 0L11.6484 0L15.6 3.9516V16.2C15.6 16.6774 15.4104 17.1352 15.0728 17.4728C14.7352 17.8104 14.2774 18 13.8 18H1.8C1.32261 18 0.864773 17.8104 0.527208 17.4728C0.189642 17.1352 0 16.6774 0 16.2V1.8ZM3 7.2H1.2V13.2H2.4V10.8H3C3.47739 10.8 3.93523 10.6104 4.27279 10.2728C4.61036 9.93523 4.8 9.47739 4.8 9C4.8 8.52261 4.61036 8.06477 4.27279 7.72721C3.93523 7.38964 3.47739 7.2 3 7.2ZM7.8 7.2H6V13.2H7.8C8.27739 13.2 8.73523 13.0104 9.07279 12.6728C9.41036 12.3352 9.6 11.8774 9.6 11.4V9C9.6 8.52261 9.41036 8.06477 9.07279 7.72721C8.73523 7.38964 8.27739 7.2 7.8 7.2ZM10.8 13.2V7.2H14.4V8.4H12V9.6H13.2V10.8H12V13.2H10.8Z"
        fill={iconColor}
      />
    </svg>
  );
};

export default PdfIcon;
