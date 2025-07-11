import {
  CopyIcon,
  SpeakerSimpleHighIcon,
  StarIcon,
  ThumbsDownIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { HistoryPopup } from "../history-popup";
import Share from "shared/assets/icons/share";
import SaveModal from "../save-modal/ui";

interface ChatActionsProps {
  onRegenerate: () => void;
  isSearching: boolean;
  hasMessages: boolean;
  isHistoryPopup?: boolean;
}

export const ChatActions: React.FC<ChatActionsProps> = ({ isHistoryPopup }) => {
  const [thumbsUpModalOpen, setThumbsUpModalOpen] = useState(false);
  const [thumbsDownModalOpen, setThumbsDownModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-2 xl:flex-col xl:justify-between w-full h-full">
      {isHistoryPopup && (
        <div className="xl:hidden block">
          <HistoryPopup />
        </div>
      )}
      <div>
        {isHistoryPopup && (
          <div className="hidden xl:block">
            <HistoryPopup />
          </div>
        )}
        <SaveModal />
      </div>

      <div className="flex xl:flex-col gap-2">
        <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
          <CopyIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
        </button>
        <button className="bg-[#DDEBF6] rounded-full h-8 w-8 flex justify-center items-center">
          <Share />
        </button>
        <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
          <SpeakerSimpleHighIcon className="w-4 h-4 m-auto text-blue-600" />
        </button>
        <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={() => setThumbsUpModalOpen(true)}
        >
          <StarIcon className="w-4 h-4 m-auto text-blue-600" />
        </button>
        <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={() => setThumbsDownModalOpen(true)}
        >
          <ThumbsDownIcon className="w-4 h-4 m-auto text-blue-600" />
        </button>
        <FeedbackModal
          initialRating={5}
          isOpen={thumbsUpModalOpen}
          onOpenChange={setThumbsUpModalOpen}
        />
        <FeedbackModal
          initialRating={1}
          isOpen={thumbsDownModalOpen}
          onOpenChange={setThumbsDownModalOpen}
        />
        {/* <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={onRegenerate}
          disabled={isSearching || !hasMessages}
          title="Regenerate response"
        >
          <RotateCw className="w-4 h-4 m-auto text-blue-600" />
        </button> */}
      </div>
    </div>
  );
};
