import React from "react";
import clsx from "clsx";
import { DocumentStatus } from "../document-card";

interface ProgressBarProps {
  status: DocumentStatus;
}

const STEPS: { id: DocumentStatus; label: string }[] = [
  { id: "ai-generated", label: "AI-generated" },
  { id: "in-review", label: "In review" },
  { id: "approved", label: "Approved" },
  { id: "published", label: "Published" },
  { id: "archived", label: "Archived" },
];

export const DocumentStatusProgress: React.FC<ProgressBarProps> = ({
  status,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.id === status);

  console.log("currentIndex", currentIndex, status);

  return (
    <div className="relative flex flex-col items-start pl-2.5 h-fit min-w-28">
      <div className="absolute bottom-1 w-px bg-gray-200 top-1 left-[18px]" />

      {STEPS.map((step, i) => {
        const isActive = i === currentIndex;

        return (
          <div
            key={step.id}
            className={clsx("flex items-center mb-8 last:mb-0", "relative")}
          >
            <div
              className={clsx({
                ["w-[18px] h-[18px] rounded-full bg-blue-500 border-2 border-black"]:
                  isActive,
                ["w-[15px] h-[15px] rounded-full bg-blue-500"]: !isActive,
              })}
            />

            <span
              className={clsx("ml-[9px] text-[10px] font-medium", {
                ["ml-[6px]"]: isActive,
              })}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
