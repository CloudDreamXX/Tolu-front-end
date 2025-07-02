import { Check } from "lucide-react";
import React from "react";

interface StepsProps {
  steps: string[];
  currentStep: number;
  ordered?: boolean;
  stepWidth?: string;
}

export const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  ordered,
  stepWidth
}) => {
  return (
    <div className="flex items-center w-full p-2 border rounded-full">
      {steps.map((step, index) => {
        let content;

        if (index > currentStep) {
          return (
            <>
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border rounded-full">
                {ordered && `${index + 1}`}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-grow h-[1px] bg-gray-300" />
              )}
            </>
          );
        } else if (index === currentStep) {
          return (
            <>
              <div
                className={`flex-shrink-0 w-fit ${stepWidth ? stepWidth : ""} px-4 h-10 flex justify-center items-center bg-gray-100 border border-gray-300 rounded-full`}
              >
                {ordered && `${index + 1}.`} {step}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-grow h-[1px] bg-gray-300" />
              )}
            </>
          );
        }
        return (
          <>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-[#BCE2C8] border border-[#062] rounded-full">
              <Check className="w-6 h-6 text-[#062]" />
            </div>
            {index < steps.length - 1 && (
              <div className="flex-grow h-[1px] bg-[#062]" />
            )}
          </>
        );
      })}
    </div>
  );
};
