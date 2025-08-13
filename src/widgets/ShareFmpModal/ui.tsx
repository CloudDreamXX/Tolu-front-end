import React, { useEffect } from "react";
import CloseIcon from "shared/assets/icons/close";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  clientName: string;
};

export const ShareFmpModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onShare,
  clientName,
}) => {
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
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shareFmpTitle"
        aria-describedby="shareFmpDesc"
        className="w-full max-w-[724px] rounded-[18px] bg-[#F9FAFB] border border-[#DBDEE1] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between">
            <h3
              id="shareFmpTitle"
              className="text-[20px] font-semibold text-[#1D1D1F]"
            >
              Share FMP tool with{" "}
              <span className="font-bold">[{clientName}]</span> ?
            </h3>
            <button onClick={onClose} className="text-[#1D1D1F]">
              <CloseIcon />
            </button>
          </div>

          <p id="shareFmpDesc" className="text-[14px] text-[#5F5F65]">
            This tool helps clients track their food, mood, and physical
            patterns. You can share this multiple times during the therapy.
          </p>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-[39px] py-[11px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onShare}
              className="px-[39px] py-[11px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
