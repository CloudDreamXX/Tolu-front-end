import { useState } from "react";
import {
  DotsThreeVerticalIcon,
  MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react";
import { ActionsPopup } from "./ui/actions-popup";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { RenamePopup } from "./ui/rename-popup";
import Collapse from "shared/assets/icons/collapse";
import { CoachService, NewChatTitle } from "entities/coach";
import { useParams } from "react-router-dom";
import { toast } from "shared/lib";
import {
  SWITCH_KEYS,
  SwitchValue,
} from "widgets/library-small-chat/switch-config";

interface ChatHeaderProps {
  displayChatTitle: string;
  isExistingChat: boolean;
  isCoach: boolean;
  selectedSwitch: string;
  isSwitch: (value: SwitchValue) => boolean;
  onNewSearch: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  displayChatTitle,
  isExistingChat,
  isCoach,
  selectedSwitch,
  isSwitch,
  onNewSearch,
  onClose,
}) => {
  const [isActionsPopupOpen, setIsActionsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const { chatId } = useParams();

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

  const handleSaveTitle = async (title: string) => {
    try {
      if (chatId) {
        const data: NewChatTitle = {
          chat_id: chatId,
          new_title: title,
        };
        await CoachService.updateChatTitle(data);
        handleClosePopup();
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to change title",
        description: "Failed to change chat title. Please try again.",
      });
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between w-full p-4 bg-white ${isCoach ? "border-b" : "md:border-b"} rounded-t-xl`}
    >
      <div className="flex items-center gap-3">
        <div className="text-[18px] md:text-[24px] xl:text-3xl font-semibold text-gray-800 flex items-center gap-[12px]">
          <button onClick={onClose} className="hidden xl:block">
            <Collapse />
          </button>
          {(isCoach || isExistingChat) && <span>{displayChatTitle}</span>}
        </div>
        {isExistingChat && (
          <div className="hidden xl:block px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
            Existing Chat
          </div>
        )}
      </div>
      <div className="hidden relative md:flex flex-col items-center justify-center gap-2 pl-[140px]">
        <div className="p-1.5 bg-[#1C63DB] rounded-lg text-white font-[500] text-[18px] flex items-center justify-center font-open w-fit">
          {selectedSwitch}
        </div>
        {isSwitch(SWITCH_KEYS.DEF) && (
          <p className="text-[18px] text-[#1D1D1F] font-[600]">
            Get Personalized Answers
          </p>
        )}
        {isSwitch(SWITCH_KEYS.LEARN) && (
          <p className="text-[18px] text-[#1D1D1F] font-[600]">
            Get Expert-verified Guidance You Can Trust
          </p>
        )}
      </div>
      <div className="flex flex-row gap-2 w-full md:w-fit mt-[8px] md:mt-0">
        <button
          className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full hover:bg-blue-700 w-full xl:w-fit"
          onClick={onNewSearch}
        >
          <MagnifyingGlassPlusIcon width={24} height={24} /> New Search
        </button>
        {isExistingChat && (
          <button
            className="flex flex-row items-center gap-2 p-2 text-sm font-medium text-white bg-[#DDEBF6] rounded-full hover:bg-blue-200"
            onClick={() => setIsActionsPopupOpen(!isActionsPopupOpen)}
          >
            <DotsThreeVerticalIcon width={24} height={24} color="#000" />
          </button>
        )}
      </div>
      {isActionsPopupOpen && (
        <ActionsPopup onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {isEditPopupOpen && (
        <RenamePopup onCancel={handleClosePopup} onSave={handleSaveTitle} />
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
