import { useState } from "react";
import {
  DotsThreeVerticalIcon,
  MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react";
import { ActionsPopup } from "./ui/actions-popup";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { RenamePopup } from "./ui/rename-popup";

interface ChatHeaderProps {
  displayChatTitle: string;
  isExistingChat: boolean;
  onNewSearch: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  displayChatTitle,
  isExistingChat,
  onNewSearch,
}) => {
  const [isActionsPopupOpen, setIsActionsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleEdit = () => {
    setIsEditPopupOpen(true);
    setIsActionsPopupOpen(false);
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(true);
    setIsActionsPopupOpen(false);
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
    setIsDeletePopupOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full p-4 bg-white border-b rounded-t-xl">
      <div className="flex items-center gap-3">
        <div className="text-[18px] md:text-[24px] xl:text-3xl font-semibold text-gray-800">
          {displayChatTitle}
        </div>
        {isExistingChat && (
          <div className="hidden xl:block px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
            Existing Chat
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2 w-full md:w-fit mt-[8px] md:mt-0">
        <button
          className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 w-full xl:w-fit"
          onClick={onNewSearch}
        >
          <MagnifyingGlassPlusIcon width={24} height={24} /> New Search
        </button>
        <button
          className="flex flex-row items-center gap-2 p-2 text-sm font-medium text-white bg-[#DDEBF6] rounded-full hover:bg-blue-200"
          onClick={() => setIsActionsPopupOpen(!isActionsPopupOpen)}
        >
          <DotsThreeVerticalIcon width={24} height={24} color="#000" />
        </button>
      </div>
      {isActionsPopupOpen && (
        <ActionsPopup onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {isEditPopupOpen && (
        <RenamePopup
          onCancel={handleClosePopup}
          onSave={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
      {isDeletePopupOpen && (
        <ConfirmDeleteModal
          style={
            "bg-[#FFF] mt-auto mx-0 md:mt-0 rounded-t-[18px] md:rounded-[12px]"
          }
          title={"Are you sure you want to delete this chat? "}
          description={
            "Deleting it will permanently remove all messages, files, and any shared content. This action cannot be undone, and you won't be able to recover the conversation later."
          }
          onCancel={handleClosePopup}
          onDelete={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};
