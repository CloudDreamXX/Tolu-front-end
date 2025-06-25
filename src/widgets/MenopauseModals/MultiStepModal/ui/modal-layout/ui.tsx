import React, { useRef } from "react";
import ArrowBack from "shared/assets/icons/arrowBack";
import Close from "shared/assets/icons/close";

interface ModalLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
  onBack: () => void;
  currentStep: number;
  isMobile: boolean;
  isTallScreen: boolean;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  children,
  onClose,
  onBack,
  currentStep,
  isMobile,
  isTallScreen,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <dialog
      className={`fixed w-full h-full md:top-0 inset-0 z-10 flex flex-col md:items-center ${currentStep === 0 ? "justify-end" : ""}
        ${
          currentStep === 0 || isTallScreen ? "md:justify-center" : ""
        } overflow-y-auto`}
      style={{
        background: isMobile
          ? "background: transparent;"
          : "rgba(0, 0, 0, 0.30)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      {currentStep !== 0 && (
        <button
          onClick={onBack}
          className="absolute z-10 top-[16px] left-[16px] md:hidden"
        >
          <ArrowBack />
        </button>
      )}
      <div
        ref={contentRef}
        className={`
          flex flex-col 
          bg-white 
          rounded-t-[18px]
          md:rounded-[18px] 
          w-full 
          md:w-[742px] 
          px-[16px]
          md:px-[24px] 
          py-[24px] 
          gap-[24px] 
          relative
          top-[64px] 
          md:top-0
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] hidden md:block"
          aria-label="Close modal"
        >
          <Close />
        </button>

        <h3
          id="modal-title"
          className="text-[24px] font-semibold text-[#1D1D1F]"
        >
          Intro questions
        </h3>
        {children}
      </div>
    </dialog>
  );
};
