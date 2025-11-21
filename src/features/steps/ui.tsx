import React, { useEffect, useRef } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const stepNode = stepRefs.current[currentStep];
    const containerNode = containerRef.current;

    if (stepNode && containerNode) {
      const stepRect = stepNode.getBoundingClientRect();
      const containerRect = containerNode.getBoundingClientRect();

      const scrollLeft =
        stepNode.offsetLeft -
        containerNode.offsetLeft -
        containerRect.width / 2 +
        stepRect.width / 2;

      containerNode.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  return (
    <div
      className="flex items-center w-full p-2 overflow-y-auto border rounded-full md:gap-0"
      ref={containerRef}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              ref={(el) => (stepRefs.current[index] = el)}
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
                <MaterialIcon iconName="check" className="w-6 h-6" />
              ) : (
                <span className="max-w-full whitespace-nowrap text-[14px] md:text-[16px]">
                  {ordered
                    ? `${index + 1}${isCurrent ? `. ${step}` : ""}`
                    : step}
                </span>
              )}
            </Button>

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
