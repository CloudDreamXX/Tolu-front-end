import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import React, { useEffect } from "react";

import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { DialogHeader } from "shared/ui";

interface ModalLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
  onBack: () => void;
  currentStep: number;
  isMobile: boolean;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  children,
  onClose,
  onBack,
  currentStep,
  isMobile,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="fixed inset-0 z-10 flex flex-col items-center pt-24 overflow-y-auto md:py-20"
        style={{
          background: isMobile ? "transparent" : "rgba(0, 0, 0, 0.30)",
          backdropFilter: isMobile ? "transparent" : "blur(2px)",
          WebkitBackdropFilter: isMobile ? "transparent" : "blur(2px)",
        }}
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
        <div className="flex flex-col bg-white rounded-[18px] w-full md:w-[742px] px-[16px] md:px-[24px] py-[24px] gap-[24px] relative pt-12 md:pt-[24px]">
          {currentStep !== 0 && (
            <button
              onClick={onBack}
              className="absolute z-10 top-[16px] left-[16px] md:hidden"
            >
              <MaterialIcon iconName="keyboard_arrow_left" size={20} />
            </button>
          )}

          <DialogClose asChild>
            <button
              className="absolute top-[16px] right-[16px] hidden md:block"
              aria-label="Close modal"
            >
              <MaterialIcon iconName="close" />
            </button>
          </DialogClose>

          <DialogHeader>
            <DialogTitle className="text-[24px] text-left font-semibold text-[#1D1D1F]">
              Intro questions
            </DialogTitle>
          </DialogHeader>

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
