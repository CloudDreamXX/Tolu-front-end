import Ai from "shared/assets/icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui/tooltip";

type Props = {
  position?: "top-right" | "top-left" | "bottom-right";
};

export const Footer: React.FC<Props> = ({ position }) => {
  return (
    <footer
      className={`flex bg-transparent ${
        position === "top-left"
          ? "py-[24px] px-[16px]"
          : position === "top-right"
            ? "fixed top-[24px] right-[19px] z-10"
            : "fixed bottom-0 right-8 pl-[40px] pb-[40px]"
      }`}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`bg-[#008FF61A] flex items-center justify-center gap-[8px] rounded-full transition-colors duration-200 hover:bg-[#008FF6] hover:bg-opacity-30 ${
                position === "top-left" || position === "top-right"
                  ? "p-[13px]"
                  : "p-[24px]"
              }`}
            >
              <Ai
                size={
                  position === "top-left" || position === "top-right" ? 15 : 28
                }
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[#1D1D1F] font-[Nunito] text-base font-normal">
              This will help match your clients to you.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </footer>
  );
};
