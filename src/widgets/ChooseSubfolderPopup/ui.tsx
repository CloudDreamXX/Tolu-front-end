import Close from "shared/assets/icons/close";
import React, { useState } from "react";
import { ChooseSubfolderPanel } from "widgets/ChooseSubfolderPanel";
import ArrowRight from "shared/assets/icons/arrow-right";
import Duplicate from "shared/assets/icons/duplicate";

interface Props {
  title: string;
  contentId: string;
  parentFolderId: string;
  handleSave: (contentId: string, folderId: string) => Promise<void>;
  onClose: () => void;
  description?: string;
}

export const ChooseSubfolderPopup: React.FC<Props> = ({
  title,
  contentId,
  parentFolderId,
  handleSave,
  onClose,
  description,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] md:max-w-[720px] lg:max-w-[742px] w-full shadow-lg mx-[16px] relative">
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
        >
          <Close />
        </button>

        <h3
          id="modal-title"
          className="text-[20px] font-semibold text-[#1D1D1F] flex items-center gap-[16px]"
        >
          {title === "Move" && <ArrowRight />}
          {title === "Duplicate" && <Duplicate />}
          {title}
        </h3>
        {description && (
          <p className="text-[14px] text-[#5F5F65] font-[500] mt-[8px]">
            {description}
          </p>
        )}
        <div className="mt-[24px]">
          <ChooseSubfolderPanel
            parentFolderId={parentFolderId}
            selectedFolderId={selectedFolderId}
            onSelect={(folderId) => setSelectedFolderId(folderId)}
          />
        </div>

        <div className="flex flex-col flex-col-reverse gap-[8px] md:flex-row md:justify-between mt-[24px] md:mt-[48px]">
          <button
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-full bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600]"
          >
            Cancel
          </button>
          <button
            disabled={!selectedFolderId}
            onClick={() =>
              selectedFolderId && handleSave(contentId, selectedFolderId)
            }
            className="px-[16px] py-[11px] rounded-full w-full md:w-[128px] text-[16px] font-[600] bg-[#1C63DB] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
