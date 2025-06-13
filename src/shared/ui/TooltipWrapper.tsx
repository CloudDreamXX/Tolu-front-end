import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
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
