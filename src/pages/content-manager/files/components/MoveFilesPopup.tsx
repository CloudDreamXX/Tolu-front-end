import { FileLibraryFolder } from "entities/files-library";
import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

export const MoveFilesPopup: React.FC<{
  folders?: FileLibraryFolder[];
  onClose: () => void;
  onMove: (folderId: string) => void;
}> = ({ folders, onClose, onMove }) => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");

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
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
        >
          <MaterialIcon iconName="close" />
        </Button>
        <h3 className="text-xl font-bold">Select Folder to Move Files</h3>
        <div className="flex flex-wrap w-full gap-2">
          {folders?.map((folder) => (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              key={folder.id}
              className={`h-[55px] w-full md:w-[49%] bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center relative border rounded-md ${selectedFolder === folder.id ? "border-blue-500" : ""}`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <div className="flex items-center gap-2">
                <MaterialIcon
                  iconName="folder"
                  fill={1}
                  className="text-blue-600"
                />
                <h3>{folder.name}</h3>
              </div>
            </Button>
          ))}
        </div>
        <div className="flex flex-col-reverse gap-[8px] md:gap-[16px] md:flex-row justify-between w-full">
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-[1000px] bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={() => onMove(selectedFolder)}
            disabled={!selectedFolder.trim()}
            className="px-[16px] py-[11px] rounded-[1000px] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white disabled:opacity-50 flex items-center justify-center"
          >
            Move
          </Button>
        </div>
      </div>
    </div>
  );
};
