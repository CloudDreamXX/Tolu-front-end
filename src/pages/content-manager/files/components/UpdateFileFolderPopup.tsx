import { FolderContentsResponse } from "entities/files-library";
import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Input } from "shared/ui";

interface UpdateFolderPopupProps {
  onClose: () => void;
  onComplete: (name: string, description: string) => void;
  folder?: FolderContentsResponse;
  mode?: "Create" | "Update" | "CreateSubfolder";
}

export const UpdateFolderPopup: React.FC<UpdateFolderPopupProps> = ({
  onClose,
  onComplete,
  folder,
  mode,
}) => {
  const [folderName, setFolderName] = useState(
    folder?.current_folder.name || ""
  );
  const [folderDescription, setFolderDescription] = useState(
    folder?.current_folder.description || ""
  );

  const handleSubmit = () => {
    onComplete(folderName, folderDescription);
  };

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center px-[16px] overflow-y-auto flex items-center justify-center`}
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
          w-full
          md:w-[742px] 
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
        >
          <MaterialIcon iconName="close" />
        </button>
        <h3 className="text-xl font-bold">
          {mode === "Create"
            ? "Create Folder"
            : mode === "CreateSubfolder"
              ? "Create Subfolder"
              : "Update Folder"}
        </h3>
        <div className="flex flex-col gap-[10px] items-start w-full">
          <label className="font-[Nunito] text-[#5F5F65] text-[12px] font-medium">
            {mode === "Create"
              ? "Create Folder"
              : mode === "CreateSubfolder"
                ? "Subfolder name"
                : "Folder name"}
          </label>
          <Input
            placeholder={
              mode === "CreateSubfolder"
                ? "Enter subfolder name"
                : "Enter folder name"
            }
            className="w-full py-[11px] px-4"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-[10px] items-start w-full">
          <label className="font-[Nunito] text-[#5F5F65] text-[12px] font-medium">
            {mode === "Create"
              ? "Create Folder"
              : mode === "CreateSubfolder"
                ? "Subfolder description"
                : "Folder description"}
          </label>
          <Input
            placeholder={
              mode === "CreateSubfolder"
                ? "Enter subfolder description (optional)"
                : "Enter folder description (optional)"
            }
            className="w-full py-[12px] px-4 text-[#5F5F65] text-[14px]"
            value={folderDescription || ""}
            onChange={(e) => setFolderDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col-reverse gap-[8px] md:gap-[16px] md:flex-row justify-between w-full">
          <button
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-[1000px] bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!folderName.trim()}
            className="px-[16px] py-[11px] rounded-[1000px] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white disabled:opacity-50 flex items-center justify-center"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
