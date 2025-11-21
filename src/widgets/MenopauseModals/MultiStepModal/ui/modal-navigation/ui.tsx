import React from "react";
import { Button } from "shared/ui";

interface ModalNavigationProps {
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  currentStep: number;
  isLastStep: boolean;
  isStepValid: boolean;
  isMobile: boolean;
}

export const ModalNavigation: React.FC<ModalNavigationProps> = ({
  onClose,
  onBack,
  onNext,
  currentStep,
  isLastStep,
  isStepValid,
  isMobile,
}) => {
  return (
    <div className="flex flex-col-reverse gap-[16px] md:flex-row justify-between w-full">
      <Button
        variant={"unstyled"}
        size={"unstyled"}
        onClick={onClose}
        className="px-[16px] py-[11px] rounded-[1000px] md:bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px]"
      >
        Cancel
      </Button>

      <div>
        {currentStep > 0 && !isMobile && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={onBack}
            className="px-[16px] py-[11px] rounded-[1000px] text-[#1C63DB] w-[128px] text-[16px] font-[600] leading-[22px]"
          >
            Back
          </Button>
        )}

        <Button
          variant={"unstyled"}
          size={"unstyled"}
          onClick={onNext}
          className={`px-[16px] py-[11px] rounded-[1000px] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white ${
            !isStepValid ? "opacity-50" : ""
          }`}
          disabled={!isStepValid}
        >
          {isLastStep ? "Done" : "Continue"}
        </Button>
      </div>
    </div>
  );
};
