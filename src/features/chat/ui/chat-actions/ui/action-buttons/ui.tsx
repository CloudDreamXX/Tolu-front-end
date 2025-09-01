import { useEffect, useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { HistoryPopup } from "../history-popup";
// import Share from "shared/assets/icons/share";
import SaveModal from "../save-modal/ui";
import { Message } from "features/chat";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface ChatActionsProps {
  chatState?: Message[];
  onRegenerate?: () => void;
  isSearching: boolean;
  hasMessages: boolean;
  isHistoryPopup?: boolean;
  onStatusChange?: (status: string) => void;
  onReadAloud: () => void;
  initialRating?: number;
  initialStatus?: string;
  fromPath?: string | null;
  isReadingAloud?: boolean;
  currentChatId?: string;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  chatState,
  isHistoryPopup,
  onStatusChange,
  initialStatus,
  onReadAloud,
  fromPath,
  isReadingAloud,
  currentChatId,
}) => {
  const [thumbsUpModalOpen, setThumbsUpModalOpen] = useState(false);
  const [thumbsDownModalOpen, setThumbsDownModalOpen] = useState(false);
  const [readStatus, setReadStatus] = useState<string>(initialStatus || "");
  const [feedbackRating, setFeedbackRating] = useState<{
    thumbsUp: boolean;
    thumbsDown: boolean;
  }>({
    thumbsUp: false,
    thumbsDown: false,
  });
  const nav = useNavigate();

  useEffect(() => {
    if (initialStatus !== undefined) {
      setReadStatus(initialStatus);
    }
  }, [initialStatus]);

  // const handleShare = async () => {
  //   const shareData = {
  //     url: window.location.href,
  //   };

  //   if (navigator.share) {
  //     try {
  //       await navigator.share(shareData);
  //     } catch (error) {
  //       console.error("Error sharing:", error);
  //     }
  //   } else {
  //     try {
  //       await navigator.clipboard.writeText(window.location.href);
  //       alert("Link copied to clipboard!");
  //     } catch (err) {
  //       console.error("Error copying link:", err);
  //     }
  //   }
  // };

  return (
    <div className="flex flex-row gap-2 xl:flex-col w-full h-[32px] xl:h-full">
      <div className="flex flex-row gap-2 xl:hidden">
        {!isHistoryPopup && (
          <button className="w-8 h-8" onClick={() => nav(-1)}>
            <MaterialIcon
              iconName="arrow_back"
              className="w-4 h-4 m-auto text-black"
            />
          </button>
        )}
        {isHistoryPopup && <HistoryPopup fromPath={fromPath} />}
        {!chatState && <SaveModal onStatusChange={onStatusChange} />}
      </div>
      <div className="flex-col self-start hidden gap-4 xl:flex">
        {!isHistoryPopup && (
          <button className="w-8 h-8" onClick={() => nav(-1)}>
            <MaterialIcon
              iconName="arrow_back"
              className="w-5 h-5 m-auto text-black"
            />
          </button>
        )}
        {isHistoryPopup && <HistoryPopup fromPath={fromPath} />}
        {!chatState && <SaveModal onStatusChange={onStatusChange} />}
        {onStatusChange && (
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => {
              const newStatus =
                readStatus === "read" ? "saved_for_later" : "read";
              setReadStatus(newStatus);
              onStatusChange(newStatus);
            }}
          >
            <MaterialIcon
              iconName="visibility"
              fill={readStatus === "read" ? 1 : 0}
              className="text-blue-600 "
            />
          </button>
        )}
      </div>

      {chatState && chatState.length > 0 && (
        <div className="flex gap-2 xl:flex-col">
          {onStatusChange && (
            <button
              className="xl:hidden block bg-[#DDEBF6] rounded-full h-8 w-8"
              onClick={() => {
                const newStatus =
                  readStatus === "read" ? "saved_for_later" : "read";
                setReadStatus(newStatus);
                onStatusChange(newStatus);
              }}
            >
              <MaterialIcon
                iconName="visibility"
                fill={readStatus === "read" ? 1 : 0}
                className="w-4 h-4 m-auto text-blue-600"
              />
            </button>
          )}
          {/* <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8 flex justify-center items-center"
          onClick={handleShare}
        >
          <Share />
        </button> */}
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={onReadAloud}
          >
            <MaterialIcon
              iconName="text_to_speech"
              fill={isReadingAloud ? 1 : 0}
              size={16}
              className="text-blue-600"
            />
          </button>
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setThumbsUpModalOpen(true)}
          >
            <MaterialIcon
              iconName="star"
              fill={feedbackRating.thumbsUp ? 1 : 0}
              size={20}
              className="text-blue-600"
            />
          </button>
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setThumbsDownModalOpen(true)}
          >
            <MaterialIcon
              iconName="thumb_down"
              fill={feedbackRating.thumbsDown ? 1 : 0}
              size={16}
              className="text-blue-600"
            />
          </button>

          <FeedbackModal
            initialRating={5}
            isOpen={thumbsUpModalOpen}
            onOpenChange={(open) => {
              setThumbsUpModalOpen(open);
            }}
            setNewRating={() => {
              setFeedbackRating((prev) => ({ ...prev, thumbsUp: true }));
            }}
            currentChatId={currentChatId}
          />
          <FeedbackModal
            initialRating={1}
            isOpen={thumbsDownModalOpen}
            onOpenChange={(open) => {
              setThumbsDownModalOpen(open);
            }}
            setNewRating={() => {
              setFeedbackRating((prev) => ({ ...prev, thumbsDown: true }));
            }}
            currentChatId={currentChatId}
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
      )}
    </div>
  );
};
