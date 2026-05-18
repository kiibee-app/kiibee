import { SuccessArcIcon } from "@/assets/icons";
import { COLORS } from "@repo/ui/colors";

type SuccessModalIconProps = {
  size?: number;
  color?: string;
};

export default function SuccessModalIcon({
  size = 40,
  color = COLORS.primary.GREEN_200,
}: SuccessModalIconProps) {
  return <SuccessArcIcon width={size} height={size} color={color} />;
}
