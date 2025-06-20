import Close from "shared/assets/icons/close";
import React, { useState } from "react";
import { ChooseSubfolderPanel } from "widgets/ChooseSubfolderPanel";

interface Props {
  title: string;
  contentId: string;
  parentFolderId: string;
  handleSave: (contentId: string, folderId: string) => Promise<void>;
  onClose: () => void;
}

export const ChooseSubfolderPopup: React.FC<Props> = ({
  title,
  contentId,
  parentFolderId,
  handleSave,
  onClose,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg mx-[16px] relative">
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
        >
          <Close />
        </button>

        <h3
          id="modal-title"
          className="text-[20px] font-semibold text-[#1D1D1F] mb-[24px]"
        >
          {title}
        </h3>
        <ChooseSubfolderPanel
          parentFolderId={parentFolderId}
          selectedFolderId={selectedFolderId}
          onSelect={(folderId) => setSelectedFolderId(folderId)}
        />

        <div className="flex justify-between mt-[24px]">
          <button
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-full bg-[#DDEBF6] text-[#1C63DB] w-[128px] text-[16px] font-[600]"
          >
            Cancel
          </button>
          <button
            disabled={!selectedFolderId}
            onClick={() =>
              selectedFolderId && handleSave(contentId, selectedFolderId)
            }
            className="px-[16px] py-[11px] rounded-full w-[128px] text-[16px] font-[600] bg-[#1C63DB] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
