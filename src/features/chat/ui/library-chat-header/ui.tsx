import { useState } from "react";
import { ActionsPopup } from "./ui/actions-popup";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { RenamePopup } from "./ui/rename-popup";
import { NewChatTitle } from "entities/coach";
import { useUpdateChatTitleMutation } from "entities/coach";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "shared/lib";
import {
  SWITCH_KEYS,
  SwitchValue,
} from "widgets/library-small-chat/switch-config";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { HistoryPopup } from "../chat-actions";
import SwitchDropdown from "widgets/library-small-chat/components/switch-dropdown/ui";
import { subTitleSwitch } from "widgets/library-small-chat/helpers";

interface ChatHeaderProps {
  displayChatTitle: string;
  isExistingChat: boolean;
  selectedSwitch: string;
  switchOptions: SwitchValue[];
  handleSwitchChange: (value: string) => void;
  isSwitch: (value: SwitchValue) => boolean;
  onNewSearch: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isExistingChat,
  selectedSwitch,
  switchOptions,
  handleSwitchChange,
  isSwitch,
  onNewSearch,
}) => {
  const location = useLocation();
  const [isActionsPopupOpen, setIsActionsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const { chatId } = useParams();
  const [updateChatTitle] = useUpdateChatTitleMutation();

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
        await updateChatTitle(data).unwrap();
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
      className={`flex flex-col items-center justify-between w-fit md:w-full md:flex-row p-4 bg-white md:border-b rounded-t-xl`}
    >
      {/* {!isContentManager && (
        <div className="flex items-center gap-3">
          <div
            className={`text-[18px] md:text-[24px] xl:text-3xl font-semibold text-gray-800 flex items-center gap-[12px]`}
          >
            <button onClick={onClose} className="hidden xl:block">
              <MaterialIcon iconName="arrows_input" size={24} />
            </button>
            {isExistingChat && <span>{displayChatTitle}</span>}
          </div>
          {isExistingChat && (
            <div className="hidden px-2 py-1 text-xs text-green-700 bg-green-100 rounded xl:block">
              Existing Chat
            </div>
          )}
        </div>
      )} */}
      <div
        className={`relative items-center justify-center hidden gap-2 md:flex flex-row`}
      >
        <SwitchDropdown
          options={switchOptions}
          handleSwitchChange={handleSwitchChange}
          selectedSwitch={selectedSwitch}
        />
        {subTitleSwitch(selectedSwitch as SwitchValue) && (
          <p
            className={`text-[#1C63DB] text-[16px] lg:text-[14px] 2xl:text-[18px] my-0`}
          >
            {subTitleSwitch(selectedSwitch as SwitchValue)}
          </p>
        )}
        {isSwitch(SWITCH_KEYS.DEF) && (
          <p className="text-[#1C63DB] text-[16px] lg:text-[14px] 2xl:text-[18px] my-0">
            Get Personalized Answers
          </p>
        )}
        {isSwitch(SWITCH_KEYS.LEARN) && (
          <p className="text-[#1C63DB] text-[16px] lg:text-[14px] 2xl:text-[18px] my-0">
            Get Expert-verified Guidance You Can Trust
          </p>
        )}
      </div>
      <div className="flex flex-row items-center gap-2 w-full md:w-fit mt-[8px] xl:mt-0">
        <HistoryPopup fromPath={location.state?.from?.pathname ?? null} />
        <button
          className="flex flex-row items-center justify-center gap-2 px-4 h-8 text-sm font-medium bg-[#1C63DB] text-white rounded-full hoverable:hover:bg-blue-700 w-[92px] xl:w-fit"
          onClick={onNewSearch}
        >
          Create
        </button>
        {isExistingChat && (
          <button
            className="flex flex-row items-center shrink-0 w-8 h-8 text-sm font-medium justify-center text-white bg-[#DDEBF6] rounded-full hover:bg-blue-200"
            onClick={() => setIsActionsPopupOpen(!isActionsPopupOpen)}
          >
            <MaterialIcon iconName="more_vert" size={20} />
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
