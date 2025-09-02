import * as React from "react";
import { cn } from "shared/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  footer?: React.ReactNode;
  footerClassName?: string;
  containerClassName?: string;
  isTitleVisible?: boolean;
  titleValue?: string;
  onTitleChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      footer,
      footerClassName,
      isTitleVisible,
      titleValue,
      onTitleChange,
      value,
      onValueChange,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col w-full rounded-[18px] border border-input bg-background px-6 py-4 min-h-fit",
          containerClassName
        )}
      >
        {isTitleVisible && (
          <input
            placeholder="Enter document title"
            value={titleValue}
            onChange={onTitleChange}
            className="text-[16px] md:text-[20px] xl:text-[24px] font-[500] text-[#1D1D1F] placeholder:text-[#1D1D1F80] outline-none pb-[16px] border-b border-[#DBDEE1] mb-[16px]"
          />
        )}
        {children ? (
          <div className="w-full">{children}</div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            disabled={disabled}
            className={cn(
              "flex min-h-[80px] w-full text-[14px] md:text-[18px] xl:text-[18px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-10 md:text-sm",
              footer ? "rounded-b-none border-b-0" : "pb-4",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
        {footer && (
          <div
            className={cn(
              "flex items-center justify-between text-sm text-gray-500 bg-white",
              disabled && "opacity-10 cursor-not-allowed",
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
