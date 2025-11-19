import React from "react";
import { Step as StepType } from "../../mock";
import { Button, Input } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface StepContentProps {
  step: StepType;
  selectedOptions: string[];
  otherInput: string;
  onOptionToggle: (optionId: string) => void;
  onOtherInputChange: (value: string) => void;
  addCustomSymptom?: () => void;
}

export const StepContent: React.FC<StepContentProps> = ({
  step,
  selectedOptions,
  otherInput,
  onOptionToggle,
  onOtherInputChange,
  addCustomSymptom = () => {},
}) => {
  return (
    <>
      <div className="flex flex-col gap-[4px]">
        <p className="text-[18px] text-[#1D1D1F] font-[700] leading-[24px]">
          {step.question}
        </p>
        {step.subtitle && (
          <p className="text-[14px] text-[#5F5F65] leading-[20px]">
            {step.subtitle}
          </p>
        )}
      </div>
      {step.other !== false && (
        <div>
          <p className="text-[16px] text-[#1D1D1F] font-[500] mb-[10px] leading-[22px]">
            Symptoms:{" "}
          </p>
          <div className="flex flex-row flex-wrap gap-2 mb-2">
            {selectedOptions.map((option) => (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => onOptionToggle(option)}
                key={option}
                className=" flex text-left px-[16px] py-[8px] rounded-[8px] bg-[#F3F7FD] border border-[#1C63DB] text-[#1C63DB] text-[16px] leading-[22px]"
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="flex flex-row">
            <Input
              placeholder="Type special symptoms here..."
              value={otherInput}
              onChange={(e) => onOtherInputChange(e.target.value)}
              className="px-4"
            />
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={addCustomSymptom}
            >
              <MaterialIcon iconName="add" className="ml-2 w-[24px] h-[24px]" />
            </Button>
          </div>
        </div>
      )}
      <div>
        {step.label && (
          <p className="text-[16px] text-[#1D1D1F] font-[500] mb-[8px] leading-[22px]">
            {step.label}
          </p>
        )}
        <div className="flex flex-wrap gap-[8px]">
          {step.options.map((option) => {
            const id = typeof option === "string" ? option : option.id;
            const label = typeof option === "string" ? option : option.name;
            const selected = selectedOptions.includes(id);

            if (
              (step.other !== false && selected) ||
              (typeof option === "string" && !option.includes(otherInput))
            ) {
              return null;
            }

            return (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                key={id}
                onClick={() => onOptionToggle(id)}
                className={`flex text-left px-[16px] py-[8px] rounded-[8px] bg-[#F3F7FD] ${
                  selected && step.other === false
                    ? "border border-[#1C63DB] text-[#1C63DB]"
                    : "border border-[#F3F7FD] text-[#1D1D1F]"
                } text-[16px] leading-[22px]`}
                disabled={
                  step.onlyOne && selectedOptions.length > 0 && !selected
                }
              >
                {label}
              </Button>
            );
          })}
        </div>
        {step.specialCondition && (
          <div className="mt-6">
            <p className="text-[16px] text-[#1D1D1F] font-[500] mb-[10px] leading-[22px]">
              Other special condition
            </p>
            <Input
              placeholder="Type special conditions here..."
              value={otherInput}
              onChange={(e) => onOtherInputChange(e.target.value)}
              className="px-4 mt-2.5"
            />
          </div>
        )}
      </div>
    </>
  );
};
