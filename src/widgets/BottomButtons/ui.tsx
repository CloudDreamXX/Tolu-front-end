import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "shared/lib";
import { Button } from "shared/ui";

interface BottomButtonsProps {
  handleNext: () => void;
  skipButton: () => void;
  isButtonActive?: () => boolean;
  handleBack?: () => void;
}

export const BottomButtons: React.FC<BottomButtonsProps> = ({
  handleNext,
  skipButton,
  isButtonActive,
  handleBack,
}) => {
  const nav = useNavigate();
  return (
    <div className="flex justify-between w-full items-center max-w-[700px] flex-col-reverse gap-6 md:flex-row">
      <Button
        variant={"unstyled"}
        size={"unstyled"}
        onClick={skipButton}
        className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
      >
        Skip this for now
      </Button>

      <div className="flex w-full gap-4 md:w-auto">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          onClick={handleBack ? handleBack : () => nav(-1)}
          className="p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
        >
          Back
        </Button>
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          onClick={handleNext}
          disabled={isButtonActive ? !isButtonActive() : false}
          className={cn(
            "p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold",
            isButtonActive
              ? isButtonActive()
                ? "bg-[#1C63DB] text-white"
                : "bg-[#DDEBF6] text-white cursor-not-allowed"
              : "bg-[#1C63DB] text-white"
          )}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
