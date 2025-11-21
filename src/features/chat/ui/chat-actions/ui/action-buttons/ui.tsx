import { useEffect, useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { Message } from "features/chat";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import SaveModal from "../save-modal/ui";
import { Button } from "shared/ui";

interface ChatActionsProps {
  chatState?: Message[];
  onRegenerate?: () => void;
  isSearching: boolean;
  hasMessages: boolean;
  isHistoryPopup?: boolean;
  onStatusChange?: (
    status: "read" | "saved_for_later" | "currently_reading"
  ) => void;
  onReadAloud: () => void;
  initialRating?: number;
  initialStatus?: string;
  fromPath?: string | null;
  isReadingAloud?: boolean;
  currentChatId?: string;
  setSharePopup?: React.Dispatch<React.SetStateAction<boolean>>;
  changeStatusDisabled?: boolean;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  chatState,
  isHistoryPopup,
  onStatusChange,
  initialStatus,
  onReadAloud,
  isReadingAloud,
  currentChatId,
  setSharePopup,
  changeStatusDisabled,
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
  const isContentManager =
    location.pathname.includes("content-manager") ||
    location.pathname.includes("clients");

  useEffect(() => {
    if (initialStatus !== undefined) {
      setReadStatus(initialStatus);
    }
  }, [initialStatus]);

  return (
    <div className="flex flex-row gap-2 xl:flex-col w-full h-[32px] xl:h-full">
      <div className="flex flex-row gap-2 xl:hidden">
        {!isHistoryPopup && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="w-8 h-8"
            onClick={() => nav(-1)}
          >
            <MaterialIcon
              iconName="arrow_back"
              className="w-4 h-4 m-auto text-black"
            />
          </Button>
        )}
        {!chatState && (
          <SaveModal
            onStatusChange={onStatusChange}
            initialStatus={initialStatus || ""}
          />
        )}
        {onStatusChange && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => {
              const newStatus =
                readStatus === "read" ? "saved_for_later" : "read";
              if (!changeStatusDisabled) {
                setReadStatus(newStatus);
              }
              onStatusChange(newStatus);
            }}
          >
            <MaterialIcon
              iconName="visibility"
              fill={readStatus === "read" ? 1 : 0}
              className="text-blue-600 "
            />
          </Button>
        )}
        {!chatState && setSharePopup && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex justify-center items-center"
            onClick={() => setSharePopup(true)}
          >
            <MaterialIcon
              iconName="share_windows"
              size={16}
              className="text-blue-600"
            />
          </Button>
        )}
      </div>
      <div className="flex-col self-start hidden gap-4 xl:flex">
        {!isHistoryPopup && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="w-8 h-8"
            onClick={() => nav(-1)}
          >
            <MaterialIcon
              iconName="arrow_back"
              className="w-5 h-5 m-auto text-black"
            />
          </Button>
        )}
        {!chatState && (
          <SaveModal
            onStatusChange={onStatusChange}
            initialStatus={initialStatus || ""}
          />
        )}
        {onStatusChange && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => {
              const newStatus =
                readStatus === "read" ? "saved_for_later" : "read";
              if (!changeStatusDisabled) {
                setReadStatus(newStatus);
              }
              onStatusChange(newStatus);
            }}
          >
            <MaterialIcon
              iconName="visibility"
              fill={readStatus === "read" ? 1 : 0}
              className="text-blue-600 "
            />
          </Button>
        )}
        {!chatState && setSharePopup && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex justify-center items-center"
            onClick={() => setSharePopup(true)}
          >
            <MaterialIcon
              iconName="share_windows"
              size={16}
              className="text-blue-600"
            />
          </Button>
        )}
      </div>

      {chatState && chatState.length > 0 && (
        <div className={`flex gap-2 ${isContentManager ? "" : "xl:flex-col"}`}>
          {onStatusChange && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="xl:hidden block bg-[#DDEBF6] rounded-full h-8 w-8"
              onClick={() => {
                const newStatus =
                  readStatus === "read" ? "saved_for_later" : "read";
                if (!changeStatusDisabled) {
                  setReadStatus(newStatus);
                }
                onStatusChange(newStatus);
              }}
            >
              <MaterialIcon
                iconName="visibility"
                fill={readStatus === "read" ? 1 : 0}
                className="w-4 h-4 m-auto text-blue-600"
              />
            </Button>
          )}
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={onReadAloud}
          >
            <MaterialIcon
              iconName="volume_up"
              fill={isReadingAloud ? 1 : 0}
              size={20}
              className="text-blue-600"
            />
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setThumbsUpModalOpen(true)}
          >
            <MaterialIcon
              iconName="star"
              fill={feedbackRating.thumbsUp ? 1 : 0}
              size={20}
              className="text-blue-600"
            />
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setThumbsDownModalOpen(true)}
          >
            <MaterialIcon
              iconName="thumb_down"
              fill={feedbackRating.thumbsDown ? 1 : 0}
              size={16}
              className="text-blue-600"
            />
          </Button>

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
          {/* <Button variant={"unstyled"} size={"unstyled"}
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={onRegenerate}
          disabled={isSearching || !hasMessages}
          title="Regenerate response"
        >
          <RotateCw className="w-4 h-4 m-auto text-blue-600" />
        </Button> */}
        </div>
      )}
    </div>
  );
};
