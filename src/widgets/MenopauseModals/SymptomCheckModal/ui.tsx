import React from "react";

import { usePageWidth } from "../../../shared/lib/hooks/use-page-width";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface SymptomCheckModalProps {
  isOpen: boolean;
  onStepModalOpen: () => void;
  onClose: () => void;
  variant?: "intro" | "completion";
}

export const SymptomCheckModal: React.FC<SymptomCheckModalProps> = ({
  isOpen,
  variant,
  onStepModalOpen,
  onClose,
}) => {
  const { isMobile } = usePageWidth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-[69px] md:top-0 inset-0 z-10 flex items-end md:items-center justify-center"
      style={{
        background: isMobile ? "#F2F4F6" : "rgba(0, 0, 0, 0.30)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div className="flex flex-col items-center justify-center bg-white rounded-t-[18px] md:rounded-[18px] md:w-[650px] xl:w-[742px] p-[16px] md:px-[32px] md:py-[24px] lg:px-[72px] lg:py-[24px] gap-[24px] text-center shadow-lg relative">
        <h2 className="text-[24px] md:text-[32px] font-[700] text-[#1D1D1F] leading-[32px] md:leading-[44px]">
          {variant === "completion" ? (
            "You’ve Mapped Out Potential Root Causes! Excellent work!"
          ) : (
            <>
              Not sure where to start? <br /> Let me help you.
            </>
          )}
        </h2>

        <p className="text-[16px] md:text-[18px] font-semibold leading-[24px] text-[#1D1D1F]">
          {variant === "completion"
            ? "Your responses guided us toward the most relevant insights, and support content for what you’re going through."
            : "Try the Symptom Checker to get personalized content tailored to your menopause journey."}
        </p>

        <div className="bg-[#DDEBF6] py-[16px] px-[16px] rounded-[20px] flex items-center gap-[16px]">
          <MaterialIcon
            iconName="stars_2"
            fill={1}
            className="w-[32px] shrink-0"
          />
          <p className="text-[16px] font-normal leading-[22px] text-[#1B2559] text-left">
            {variant === "completion"
              ? "Let’s explore it together."
              : "It’s fast, private, and designed to help you feel better—starting today."}
          </p>
        </div>
        <div className="w-full md:w-fit flex flex-col gap-[16px]">
          <button
            className="w-full md:w-fit py-[11px] px-[24px] bg-[#1C63DB] text-white leading-[22px] rounded-full text-[16px] font-semibold"
            onClick={onStepModalOpen}
          >
            {variant === "completion" ? "Show My Results" : "Start My Check-In"}
          </button>
          {isMobile && (
            <button
              className="w-full md:w-fit py-[11px] px-[24px] text-[#1C63DB] leading-[22px] rounded-full text-[16px] font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={onClose}
            className="absolute text-sm text-gray-500 top-4 right-4 hover:text-black"
          >
            <MaterialIcon iconName="close" />
          </button>
        )}
      </div>
    </div>
  );
};
