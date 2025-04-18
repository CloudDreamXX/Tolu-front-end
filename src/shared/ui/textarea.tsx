import * as React from "react";

import { cn } from "shared/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  footer?: React.ReactNode;
  footerClassName?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, containerClassName, footer, footerClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col w-full", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-6 pt-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            footer ? "rounded-b-none border-b-0" : "pb-4",
            className
          )}
          ref={ref}
          {...props}
        />
        {footer && (
          <div
            className={cn(
              "flex items-center justify-between px-6 pb-4 text-sm text-gray-500 bg-white border border-t-0 border-input rounded-b-md",
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
