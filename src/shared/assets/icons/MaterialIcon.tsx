import { cn } from "shared/lib";
import { IconName } from "shared/lib/utils/iconsConfig";

interface MaterialIconProps {
  iconName: IconName;
  size?: number;
  className?: string;
  weight?: number;
  fill?: 1 | 0;
  grad?: -25 | 0 | 25;
}

export const MaterialIcon = ({
  iconName,
  size = 24,
  className,
  weight = 400,
  fill = 0,
  grad = 0,
}: MaterialIconProps) => {
  const dynamicStyle = {
    fontSize: `${size}px`,
    fontVariationSettings: `"opsz" ${size}, "wght" ${weight}, "FILL" ${fill}, "GRAD" ${grad}`,
  };

  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={dynamicStyle}
    >
      {iconName}
    </span>
  );
};
