import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";

interface SnapshotProps {
  title: string;
  content?: string;
  active?: boolean;
  topRightButton?: React.ReactNode;
  tooltipContent?: string;
  className?: string;
}

export const Snapshot: React.FC<SnapshotProps> = ({
  title,
  content,
  tooltipContent,
  topRightButton,
  active = true,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-4 bg-[#F3F7FD] rounded-lg flex flex-col gap-4 flex-1 relative",
        {
          "bg-[#ECEFF4]": !active,
        },
        className
      )}
    >
      <div className="flex items-center gap-1">
        <p
          className={cn("text-sm text-[#1D1D1F] font-semibold", {
            "text-[#5F5F6566]": !active,
          })}
        >
          {title}
        </p>

        {tooltipContent && (
          <TooltipProvider delayDuration={500} disableHoverableContent>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn("cursor-pointer", {
                    "cursor-not-allowed": !active,
                  })}
                >
                  <MaterialIcon
                    iconName="help"
                    size={20}
                    className={cn("text-[#AAC6EC]", {
                      "text-[#5F5F6566]": !active,
                    })}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="z-50 p-[16px] max-w-[309px]"
              >
                <div className="text-[#1B2559] text-sm leading-[1.4] font-medium">
                  {tooltipContent}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p
        className={cn("text-lg font-bold text-[#1C63DB]", {
          "text-[#5F5F6566]": !active,
        })}
      >
        {content || "..."}

        {topRightButton && (
          <span className="block md:hidden ">{topRightButton}</span>
        )}
      </p>

      {topRightButton && (
        <div className="absolute hidden md:block top-2 right-2">
          {topRightButton}
        </div>
      )}
    </div>
  );
};
