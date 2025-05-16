import React from "react";
import { useNavigate } from "react-router-dom";

interface BottomButtonsProps {
  handleNext: () => void;
  skipButton: () => void;
  isButtonActive: () => boolean;
}

export const BottomButtons: React.FC<BottomButtonsProps> = ({
  handleNext,
  skipButton,
  isButtonActive,
}) => {
  const nav = useNavigate();
  return (
    <div className="flex justify-between items-center w-full max-w-[700px]">
      <button
        onClick={skipButton}
        className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
      >
        Skip this for now
      </button>
      <div className="flex items-center gap-4">
        <button
          onClick={() => nav(-1)}
          className="p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className={
            isButtonActive()
              ? "p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#1C63DB] text-white"
              : "p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-white"
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
};
