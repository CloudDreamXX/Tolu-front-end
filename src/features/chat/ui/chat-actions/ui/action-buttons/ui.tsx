import {
  CopyIcon,
  ShareIcon,
  SpeakerSimpleHighIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { HistoryPopup } from "../history-popup";

interface ChatActionsProps {
  onRegenerate: () => void;
  isSearching: boolean;
  hasMessages: boolean;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  onRegenerate,
  isSearching,
  hasMessages,
}) => {
  const [thumbsUpModalOpen, setThumbsUpModalOpen] = useState(false);
  const [thumbsDownModalOpen, setThumbsDownModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-between">
      <HistoryPopup />

      <div className="flex flex-col gap-2">
        <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
          <CopyIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
        </button>
        <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
          <ShareIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
        </button>
        <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
          <SpeakerSimpleHighIcon
            weight="bold"
            className="w-4 h-4 m-auto text-blue-600"
          />
        </button>
        <FeedbackModal
          initialRating={5}
          isOpen={thumbsUpModalOpen}
          onOpenChange={setThumbsUpModalOpen}
        >
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8"
            onClick={() => setThumbsUpModalOpen(true)}
          >
            <ThumbsUpIcon
              weight="bold"
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
        </FeedbackModal>
        <FeedbackModal
          initialRating={1}
          isOpen={thumbsDownModalOpen}
          onOpenChange={setThumbsDownModalOpen}
        >
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8"
            onClick={() => setThumbsDownModalOpen(true)}
          >
            <ThumbsDownIcon
              weight="bold"
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
        </FeedbackModal>
        <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={onRegenerate}
          disabled={isSearching || !hasMessages}
          title="Regenerate response"
        >
          <RotateCw className="w-4 h-4 m-auto text-blue-600" />
        </button>
      </div>
    </div>
  );
};
