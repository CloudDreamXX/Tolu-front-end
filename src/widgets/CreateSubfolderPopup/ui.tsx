import React, { useState } from "react";
import Close from "shared/assets/icons/close";
import { Input } from "shared/ui";

interface CreateFolderPopupProps {
  onClose: () => void;
  onComplete: (name: string, description: string) => Promise<void>;
}

export const CreateSubfolderPopup: React.FC<CreateFolderPopupProps> = ({
  onClose,
  onComplete,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await onComplete(name.trim(), description.trim());
    } catch (error) {
      console.error("Error creating subfolder:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isCreating) {
      handleComplete();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center overflow-y-auto flex items-center justify-center`}
      style={{
        background: "rgba(0, 0, 0, 0.30)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`
          flex flex-col 
          bg-white 
          rounded-[18px] 
          w-[742px] 
          px-[24px] 
          py-[24px] 
          gap-[24px] 
          relative
          top-0
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
          disabled={isCreating}
        >
          <Close />
        </button>

        <h3
          id="modal-title"
          className="text-[24px] font-semibold text-[#1D1D1F]"
        >
          New subfolder
        </h3>
        <p className="text-[14px] text-[#5F5F65] font-[500]">
          Create a new subfolder to organize your content better.
        </p>

        <div className="flex flex-col gap-[10px] items-start w-full">
          <label className="font-[Nunito] text-[#5F5F65] text-[12px] font-medium">
            Subfolder name *
          </label>
          <Input
            placeholder="Enter subfolder name"
            className="w-full py-[11px] px-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-[10px] items-start w-full">
          <label className="font-[Nunito] text-[#5F5F65] text-[12px] font-medium">
            Subfolder description
          </label>
          <Input
            placeholder="Enter subfolder description (optional)"
            className="w-full py-[12px] px-4 text-[#5F5F65] text-[14px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
          />
        </div>
        <div className="flex gap-[16px] flex-row justify-between w-full">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-[16px] py-[11px] rounded-[1000px] bg-[#DDEBF6] text-[#1C63DB] w-[128px] text-[16px] font-[600] leading-[22px] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={!name.trim() || isCreating}
            className="px-[16px] py-[11px] rounded-[1000px] w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white disabled:opacity-50 flex items-center justify-center"
          >
            {isCreating ? (
              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
