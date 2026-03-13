import * as React from "react";

import { twMerge } from "tailwind-merge";
import { Button } from "./button";
import { cn } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type InputVariant = "default" | "bottom-border" | "none";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: InputVariant;
  containerClassName?: string;
  onIconClick?: () => void;
  clearable?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      icon,
      iconRight,
      type,
      value,
      defaultValue,
      onChange,
      disabled,
      readOnly,
      onIconClick,
      clearable = true,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(() => {
      if (typeof defaultValue === "string") return defaultValue;
      if (defaultValue === undefined || defaultValue === null) return "";

      return String(defaultValue);
    });

    React.useImperativeHandle(
      ref,
      () => internalRef.current as HTMLInputElement
    );

    const currentValue = isControlled
      ? value === undefined || value === null
        ? ""
        : String(value)
      : internalValue;

    const showClearButton =
      clearable && currentValue.length > 0 && !disabled && !readOnly;
    const hasRightControl = Boolean(iconRight) || showClearButton;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }

      onChange?.(event);
    };

    const handleClear = () => {
      const input = internalRef.current;
      if (!input) return;

      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;

      nativeValueSetter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));

      if (!isControlled) {
        setInternalValue("");
      }

      input.focus();
    };

    return (
      <div className={cn("relative w-full", containerClassName)}>
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
            icon ? "pl-10" : "pl-4",
            hasRightControl && "pr-10",
            className
          )}
          ref={internalRef}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
        {hasRightControl && (
          <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 gap-2 pointer-events-none">
            {showClearButton && (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="button"
                className="cursor-pointer pointer-events-auto text-muted-foreground hover:text-foreground text-xs leading-none"
                onClick={handleClear}
                aria-label="Clear input"
              >
                <MaterialIcon iconName="close" size={14} />
              </Button>
            )}
            {iconRight && (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="button"
                className="cursor-pointer pointer-events-auto"
                onClick={onIconClick}
              >
                {iconRight}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
