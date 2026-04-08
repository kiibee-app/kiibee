import type { SVGProps } from "react";
import React from "react";
import { COLORS } from "@repo/ui/colors";
import {
  CATEGORY_ICON_HEIGHT,
  CATEGORY_ICON_WIDTH,
  ICON_SVG_PROP_NAMES,
  SVG_XMLNS,
} from "@/utils/Constants";

type LeftIconBaseProps = Omit<
  SVGProps<SVGSVGElement>,
  (typeof ICON_SVG_PROP_NAMES)[number]
>;

export interface LeftIconProps extends LeftIconBaseProps {
  width?: number;
  height?: number;
  color?: string;
  active?: boolean;
}

export const LeftIcon: React.FC<LeftIconProps> = ({
  width = CATEGORY_ICON_WIDTH,
  height = CATEGORY_ICON_HEIGHT,
  color,
  className,
  active = false,
  ...rest
}) => {
  const iconColor = color ?? COLORS.primary.BLACK;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns={SVG_XMLNS}
      className={className}
      aria-label="Back"
      {...rest}
    >
      <path
        d="M8.45401 2.76544C8.38635 2.69383 8.33345 2.6096 8.29834 2.51756C8.26323 2.42551 8.24659 2.32745 8.24937 2.22897C8.25216 2.1305 8.27432 2.03353 8.31457 1.94362C8.35483 1.8537 8.41241 1.7726 8.48401 1.70494C8.55561 1.63727 8.63984 1.58438 8.73189 1.54926C8.82394 1.51415 8.922 1.49751 9.02047 1.5003C9.11895 1.50309 9.21592 1.52524 9.30583 1.5655C9.39574 1.60576 9.47685 1.66333 9.54451 1.73494L15.9195 8.48494C16.0512 8.62419 16.1245 8.80855 16.1245 9.00019C16.1245 9.19182 16.0512 9.37618 15.9195 9.51544L9.54451 16.2662C9.47729 16.3394 9.39621 16.3984 9.30596 16.44C9.21572 16.4816 9.11811 16.5048 9.01882 16.5083C8.91952 16.5119 8.82051 16.4956 8.72755 16.4606C8.63458 16.4255 8.5495 16.3723 8.47726 16.3041C8.40502 16.2359 8.34706 16.154 8.30673 16.0632C8.26641 15.9724 8.24453 15.8745 8.24237 15.7751C8.2402 15.6758 8.2578 15.577 8.29413 15.4845C8.33046 15.3921 8.38481 15.3077 8.45401 15.2364L14.343 9.00019L8.45401 2.76544Z"
        fill={iconColor}
      />
    </svg>
  );
};

export default LeftIcon;
