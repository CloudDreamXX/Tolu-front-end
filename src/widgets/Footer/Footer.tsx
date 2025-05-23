import Ai from "shared/assets/icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui/tooltip";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 right-8 flex pr-[40] pl-[40px] pb-[40px] bg-transparent">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="bg-[#008FF61A] flex p-[24px] items-center justify-center gap-[8px] rounded-full transition-colors duration-200 hover:bg-[#008FF6] hover:bg-opacity-30">
              <Ai />
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
