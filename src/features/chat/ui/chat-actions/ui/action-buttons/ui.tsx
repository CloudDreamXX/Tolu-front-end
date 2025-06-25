import {
  CopyIcon,
  ShareIcon,
  SpeakerSimpleHighIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { RotateCw } from "lucide-react";
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
}) => (
  <div className="flex flex-col gap-2">
    <HistoryPopup />
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
    <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
      <ThumbsUpIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
    </button>
    <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
      <ThumbsDownIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
    </button>
    <button
      className="bg-[#DDEBF6] rounded-full h-8 w-8"
      onClick={onRegenerate}
      disabled={isSearching || !hasMessages}
      title="Regenerate response"
    >
      <RotateCw className="w-4 h-4 m-auto text-blue-600" />
    </button>
  </div>
);
