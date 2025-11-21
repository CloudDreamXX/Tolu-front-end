import { Button as ShadcnButton } from "shared/ui";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | React.ReactNode;
  bg?: string;
  width?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  width,
  text,
  bg,
  className,
  ...rest
}) => {
  return (
    <ShadcnButton
      variant={"unstyled"}
      size={"unstyled"}
      disabled={disabled}
      {...rest}
      className={`${width ?? "w-full sm:w-auto"} ${bg ?? "bg-[rgb(152, 153, 155)]"} 
        p-3 bg-[rgb(152, 153, 155)] px-4 gap-2 rounded-lg text-sm font-semibold  flex items-center justify-center  hover:text-black transition-all 
        duration-100 ${
          disabled ? "opacity-[50%] cursor-not-allowed" : "cursor-pointer"
        } ${className ?? ""}`}
    >
      {children}
      {text}
    </ShadcnButton>
  );
};
