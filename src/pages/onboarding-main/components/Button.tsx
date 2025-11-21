import { Button as ShadcnButton } from "shared/ui";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "blue"
    | "blue2"
    | "brightblue"
    | "black"
    | "light-blue"
    | "unstyled"
    | null;
  size?: "default" | "unstyled" | "sm" | "lg" | "icon" | null;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style,
  variant,
  size,
}) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      style={style}
      onClick={onClick}
      className="flex py-[10px] px-[32px] items-center justify-center gap-[6px] rounded-full border-[1px] border-[#BFBFBF] text-[#2D2D2D]  text-[16px]/[20px] font-semibold"
    >
      {children}
    </ShadcnButton>
  );
};
