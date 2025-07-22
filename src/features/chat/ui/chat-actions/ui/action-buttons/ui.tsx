import {
  SpeakerSimpleHighIcon,
  StarIcon,
  ThumbsDownIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { HistoryPopup } from "../history-popup";
import Share from "shared/assets/icons/share";
import SaveModal from "../save-modal/ui";
import { Eye } from "@phosphor-icons/react/dist/ssr";

interface ChatActionsProps {
  onRegenerate: () => void;
  isSearching: boolean;
  hasMessages: boolean;
  isHistoryPopup?: boolean;
  onStatusChange?: (status: string) => void;
  initialRating?: number;
  initialStatus?: string;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  isHistoryPopup,
  onStatusChange,
  initialRating,
  initialStatus,
}) => {
  const [thumbsUpModalOpen, setThumbsUpModalOpen] = useState(false);
  const [thumbsDownModalOpen, setThumbsDownModalOpen] = useState(false);
  const [rating, setRating] = useState<number | undefined>(initialRating);
  const [readStatus, setReadStatus] = useState<string>(initialStatus || "");

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
        <SaveModal onStatusChange={onStatusChange} />
        {onStatusChange && (
          <button
            className="hidden xl:block bg-[#DDEBF6] rounded-full h-8 w-8 mt-[8px]"
            onClick={() => {
              onStatusChange(
                readStatus === "read" ? "saved_for_later" : "read"
              );
              setReadStatus(readStatus === "read" ? "saved_for_later" : "read");
            }}
          >
            <Eye
              weight={readStatus === "read" ? "fill" : "regular"}
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
        )}
      </div>

      <div className="flex xl:flex-col gap-2">
        {onStatusChange && (
          <button
            className="xl:hidden block bg-[#DDEBF6] rounded-full h-8 w-8"
            onClick={() => {
              onStatusChange(
                readStatus === "read" ? "saved_for_later" : "read"
              );
              setReadStatus(readStatus === "read" ? "saved_for_later" : "read");
            }}
          >
            <Eye
              weight={readStatus === "read" ? "fill" : "regular"}
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
        )}
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
          <StarIcon
            weight={rating === 5 ? "fill" : "regular"}
            className="w-4 h-4 m-auto text-blue-600"
          />
        </button>
        <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={() => setThumbsDownModalOpen(true)}
        >
          <ThumbsDownIcon
            weight={rating === 1 ? "fill" : "regular"}
            className="w-4 h-4 m-auto text-blue-600"
          />
        </button>

        <FeedbackModal
          initialRating={5}
          isOpen={thumbsUpModalOpen}
          onOpenChange={(open) => {
            setThumbsUpModalOpen(open);
            if (!open) setRating(5);
          }}
        />
        <FeedbackModal
          initialRating={1}
          isOpen={thumbsDownModalOpen}
          onOpenChange={(open) => {
            setThumbsDownModalOpen(open);
            if (!open) setRating(1);
          }}
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
