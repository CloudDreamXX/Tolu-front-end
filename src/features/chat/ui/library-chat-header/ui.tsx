import {
  DotsThreeVerticalIcon,
  MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react";

interface ChatHeaderProps {
  displayChatTitle: string;
  isExistingChat: boolean;
  onNewSearch: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  displayChatTitle,
  isExistingChat,
  onNewSearch,
}) => (
  <div className="flex items-center justify-between w-full p-4 bg-white border-b rounded-t-xl">
    <div className="flex items-center gap-3">
      <div className="text-3xl font-semibold text-gray-800">
        {displayChatTitle}
      </div>
      {isExistingChat && (
        <div className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
          Existing Chat
        </div>
      )}
    </div>
    <div className="flex flex-row gap-2">
      <button
        className="flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
        onClick={onNewSearch}
      >
        <MagnifyingGlassPlusIcon width={24} height={24} /> New Search
      </button>
      <button className="flex flex-row items-center gap-2 p-2 text-sm font-medium text-white bg-[#DDEBF6] rounded-full hover:bg-blue-200">
        <DotsThreeVerticalIcon width={24} height={24} color="#000" />
      </button>
    </div>
  </div>
);
