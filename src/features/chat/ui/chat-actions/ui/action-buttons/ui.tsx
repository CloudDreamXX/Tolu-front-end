import {
  SpeakerSimpleHighIcon,
  StarIcon,
  ThumbsDownIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { HistoryPopup } from "../history-popup";
import Share from "shared/assets/icons/share";
import SaveModal from "../save-modal/ui";
import { ArrowLeft, Eye } from "@phosphor-icons/react/dist/ssr";
import { useNavigate } from "react-router-dom";

interface ChatActionsProps {
  onRegenerate: () => void;
  isSearching: boolean;
  hasMessages: boolean;
  isHistoryPopup?: boolean;
  onStatusChange?: (status: string) => void;
  onReadAloud: () => void;
  initialRating?: number;
  initialStatus?: string;
  fromPath?: string | null;
  isReadingAloud?: boolean;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  isHistoryPopup,
  onStatusChange,
  initialRating,
  initialStatus,
  onReadAloud,
  fromPath,
  isReadingAloud,
}) => {
  const [thumbsUpModalOpen, setThumbsUpModalOpen] = useState(false);
  const [thumbsDownModalOpen, setThumbsDownModalOpen] = useState(false);
  const [rating, setRating] = useState<number | undefined>(initialRating);
  const [readStatus, setReadStatus] = useState<string>(initialStatus || "");
  const nav = useNavigate();

  useEffect(() => {
    if (initialRating !== undefined) {
      setRating(initialRating);
    }
  }, [initialRating]);

  const handleShare = async () => {
    const shareData = {
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Error copying link:", err);
      }
    }
  };

  return (
    <div className="flex flex-row gap-2 xl:flex-col justify-between w-full h-[32px] xl:h-full">
      <div className="xl:hidden block flex flex-row gap-2">
        {!isHistoryPopup && (
          <button className="h-8 w-8" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 m-auto text-black" />
          </button>
        )}
        {isHistoryPopup && <HistoryPopup fromPath={fromPath} />}
        <SaveModal onStatusChange={onStatusChange} />
      </div>
      <div className="hidden xl:block">
        {!isHistoryPopup && (
          <button className="h-8 w-8 mb-[8px]" onClick={() => nav(-1)}>
            <ArrowLeft className="w-5 h-5 m-auto text-black" />
          </button>
        )}
        {isHistoryPopup && <HistoryPopup fromPath={fromPath} />}
        <SaveModal onStatusChange={onStatusChange} />
        {onStatusChange && (
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8 mt-[8px]"
            onClick={() => {
              const newStatus =
                readStatus === "read" ? "saved_for_later" : "read";
              setReadStatus(newStatus);
              onStatusChange(newStatus);
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
              const newStatus =
                readStatus === "read" ? "saved_for_later" : "read";
              setReadStatus(newStatus);
              onStatusChange(newStatus);
            }}
          >
            <Eye
              weight={readStatus === "read" ? "fill" : "regular"}
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
        )}
        <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8 flex justify-center items-center"
          onClick={handleShare}
        >
          <Share />
        </button>
        <button
          className="bg-[#DDEBF6] rounded-full h-8 w-8"
          onClick={onReadAloud}
        >
          <SpeakerSimpleHighIcon
            weight={isReadingAloud ? "fill" : "regular"}
            className="w-4 h-4 m-auto text-blue-600"
          />
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
