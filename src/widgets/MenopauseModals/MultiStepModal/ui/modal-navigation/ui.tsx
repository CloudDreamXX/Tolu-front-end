import React from "react";

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
    <div className="flex flex-col flex-col-reverse gap-[16px] md:flex-row justify-between w-full">
      <button
        onClick={onClose}
        className="px-[16px] py-[11px] rounded-[1000px] md:bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px]"
      >
        Cancel
      </button>

      <div>
        {currentStep > 0 && !isMobile && (
          <button
            onClick={onBack}
            className="px-[16px] py-[11px] rounded-[1000px] text-[#1C63DB] w-[128px] text-[16px] font-[600] leading-[22px]"
          >
            Back
          </button>
        )}

        <button
          onClick={onNext}
          className={`px-[16px] py-[11px] rounded-[1000px] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white ${
            !isStepValid ? "opacity-50" : ""
          }`}
          disabled={!isStepValid}
        >
          {isLastStep ? "Done" : "Continue"}
        </button>
      </div>
    </div>
  );
};
