import * as React from "react";

import { cn } from "shared/lib/utils";
import { twMerge } from "tailwind-merge";

type InputVariant = "default" | "bottom-border" | "none";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: InputVariant;
  onIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      icon,
      iconRight,
      type,
      onIconClick,
      variant = "default",
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-[12px] flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={twMerge(
            "flex h-10 w-full bg-background py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            variant === "default" &&
              "rounded-md border border-input focus-visible:outline-none",
            variant === "bottom-border" &&
              "border-0 border-b border-input rounded-none focus-visible:border-b-2 focus-visible:border-primary",
            icon && "pl-10",
            iconRight && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {iconRight && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer
               pointer-events-auto"
            onClick={onIconClick}
          >
            {iconRight}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
