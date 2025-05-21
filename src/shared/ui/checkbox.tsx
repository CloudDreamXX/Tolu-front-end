import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "shared/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    checkClassName?: string;
  }
>(({ className, checkClassName, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
  "peer h-6 w-6 shrink-0 rounded-[2px] border-2 border-[#B0B0B8] bg-white transition-colors duration-150",
  "data-[state=checked]:border-[#1C63DB] data-[state=checked]:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C63DB]",
  className
)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className={cn("w-4 h-4 text-[#1C63DB]", checkClassName)} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
//border-[#1C63DB]