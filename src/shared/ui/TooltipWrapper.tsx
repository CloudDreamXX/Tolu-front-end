import { usePageWidth } from "shared/lib";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from ".";
import { useState } from "react";

interface TooltipWrapperProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const tooltipContentStyle =
  "max-w-xs p-3 text-sm text-[#1B2559] font-semibold w-fit";
const tooltipTriggerStyle =
  "bg-transparent border-none p-0 cursor-default w-fit";

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  content,
  children,
}) => {
  const { isMobileOrTablet } = usePageWidth();

  const [open, setOpen] = useState(false);

  if (isMobileOrTablet) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            type="button"
            className={tooltipTriggerStyle}
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {children}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={tooltipContentStyle}
          side="top"
          align="center"
          onPointerDownOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            type="button"
            className={tooltipTriggerStyle}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent className={tooltipContentStyle}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
