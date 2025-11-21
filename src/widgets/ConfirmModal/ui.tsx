import React, { useEffect, useId } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
      onClick={() => onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={
          "w-full md:max-w-[742px] rounded-[18px] bg-[#F9FAFB] border border-[#DBDEE1] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between">
            <h3
              id={titleId}
              className="text-[20px] font-semibold text-[#1D1D1F]"
            >
              {title}
            </h3>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={onClose}
              className="text-[#1D1D1F]"
              aria-label="Close"
            >
              <MaterialIcon iconName="close" />
            </Button>
          </div>

          {description ? (
            <p id={descId} className="text-[14px] text-[#5F5F65]">
              {description}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={onClose}
              className="w-full md:w-fit px-[39px] py-[11px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            >
              {cancelText}
            </Button>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={onConfirm}
              className={
                "w-full md:w-fit px-[39px] py-[11px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              }
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
