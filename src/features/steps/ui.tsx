import { Check } from "lucide-react";
import React from "react";

interface StepsProps {
  steps: string[];
  currentStep: number;
  ordered?: boolean;
  stepWidth?: string;
  onStepClick: (index: number) => void;
  disabled?: boolean;
}

export const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  ordered,
  stepWidth,
  onStepClick,
  disabled = false,
}) => {
  return (
    <div className="flex items-center md:gap-0 w-full p-2 border rounded-full overflow-y-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onStepClick(index)}
              className={`flex items-center justify-center w-10 h-10 transition-all rounded-full  ${
                isCompleted
                  ? "w-10 bg-[#BCE2C8] border border-[#062] text-[#062] shrink-0"
                  : isCurrent
                    ? `px-4 ${stepWidth || ""} w-fit bg-gray-100 border border-gray-300 text-black text-[12px] md:text-[16px] font-medium`
                    : "w-10 border border-gray-300 text-gray-600 shrink-0"
              }`}
            >
              {isCompleted ? (
                <Check className="w-6 h-6" />
              ) : (
                <span className="max-w-full whitespace-nowrap text-[14px] md:text-[16px]">
                  {ordered
                    ? `${index + 1}${isCurrent ? `. ${step}` : ""}`
                    : step}
                </span>
              )}
            </button>

            {index < steps.length - 1 && (
              <div
                className={`flex-grow min-w-[16px] h-[1px] ${isCompleted ? "bg-[#062]" : "bg-gray-300"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
