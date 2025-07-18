import { usePageWidth } from "shared/lib";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from ".";

interface TooltipWrapperProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const tooltipContentStyle = "max-w-xs p-3 text-sm text-[#1B2559] font-semibold";
const tooltipTriggerStyle = "bg-transparent border-none p-0 cursor-default";

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  content,
  children,
}) => {
  const { isMobileOrTablet } = usePageWidth();

  if (isMobileOrTablet) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className={tooltipTriggerStyle}>
            {children}
          </button>
        </PopoverTrigger>
        <PopoverContent className={tooltipContentStyle}>
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={tooltipTriggerStyle}>
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent className={tooltipContentStyle}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
