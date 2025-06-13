import React, { useState } from "react";
import Close from "shared/assets/icons/close";

interface ChangeStatusPopupProps {
  onClose: () => void;
  onComplete: (
    status:
      | "Raw"
      | "Ready for Review"
      | "Waiting"
      | "Second Review Requested"
      | "Ready to Publish"
      | "Live"
      | "Archived"
  ) => Promise<void>;
}

const FOLDER_STATUS_MAPPING = {
  Raw: "AI-Generated",
  "Ready for Review": "In-Review",
  Waiting: "In-Review",
  "Second Review Requested": "In-Review",
  "Ready to Publish": "Approved",
  Live: "Published",
  Archived: "Archived",
} as const;

const UI_TO_BACKEND_STATUS: Record<string, keyof typeof FOLDER_STATUS_MAPPING> =
  {};
Object.entries(FOLDER_STATUS_MAPPING).forEach(([backend, ui]) => {
  if (!(ui in UI_TO_BACKEND_STATUS)) {
    UI_TO_BACKEND_STATUS[ui] = backend as keyof typeof FOLDER_STATUS_MAPPING;
  }
});

const STATUS_OPTIONS = Array.from(
  new Set(Object.values(FOLDER_STATUS_MAPPING))
);

export const ChangeStatusPopup: React.FC<ChangeStatusPopupProps> = ({
  onClose,
  onComplete,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleSave = () => {
    if (selectedStatus) {
      const backendValue = UI_TO_BACKEND_STATUS[selectedStatus];
      if (backendValue) {
        onComplete(backendValue);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#F9FAFB] rounded-[18px] w-[742px] px-[24px] py-[24px] flex flex-col gap-[24px] relative">
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
        >
          <Close />
        </button>

        <h3
          id="modal-title"
          className="text-[24px] font-semibold text-[#1D1D1F]"
        >
          Mark as
        </h3>
        <p className="text-[14px] text-[#5F5F65] font-[500]">
          Lorem ipsum dolor sit amet consectetur. Convallis ut rutrum diam quam.
        </p>

        <div className="flex flex-col gap-[8px]">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`text-left w-full px-[12px] py-[12px] text-[18px] font-semibold rounded-[8px] border
                ${
                  selectedStatus === status
                    ? "border-[#1D1D1F] bg-[#F9FAFB]"
                    : "border-transparent bg-white"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-[8px]">
          <button
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-full bg-[#DDEBF6] text-[#1C63DB] w-[128px] text-[16px] font-[600]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-[16px] py-[11px] rounded-full w-[128px] text-[16px] font-[600] bg-[#1C63DB] text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
