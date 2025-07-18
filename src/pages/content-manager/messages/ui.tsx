import { useEffect, useState } from "react";

import { usePageWidth } from "shared/lib";
import { MessageSidebar } from "widgets/message-sidebar";
import { MessageTabs } from "widgets/message-tabs/ui";
import { ChatItemModel, chatItems } from "./mock";
import LoadingIcon from "shared/assets/icons/loading-icon";

export const ContentManagerMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedChats, setFetchedChats] = useState<ChatItemModel[]>([]);
  const { isMobileOrTablet } = usePageWidth();

  useEffect(() => {
    // Simulate data fetching
    const timeout = setTimeout(() => {
      setFetchedChats(chatItems);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const chatItemClick = (chatItem: ChatItemModel) => {
    if (selectedChat === chatItem) {
      setSelectedChat(null);
    } else {
      setSelectedChat(chatItem);
    }
  };

  if (selectedChat && isMobileOrTablet) {
    return (
      <MessageTabs
        chatId={selectedChat?.id}
        goBackMobile={() => setSelectedChat(null)}
      />
    );
  }

  if (!selectedChat && isMobileOrTablet) {
    return (
      <MessageSidebar
        chats={fetchedChats}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex h-full bg-slate-[#DBDEE1] border">
      {loading && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-25%]">
          <LoadingIcon />
          Please wait, we are loading the information...
        </div>
      )}
      <MessageSidebar
        chats={fetchedChats}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        loading={loading}
      />
      <MessageTabs
        chatId={selectedChat?.id}
        goBackMobile={() => setSelectedChat(null)}
      />
    </div>
  );
};
