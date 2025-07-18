import { useEffect, useState } from "react";

import { usePageWidth } from "shared/lib";
import { MessageSidebar } from "widgets/message-sidebar";
import { MessageTabs } from "widgets/message-tabs/ui";
import { ChatItemModel, chatItems } from "./mock";
import LoadingIcon from "shared/assets/icons/loading-icon";
import EmptyChat from "shared/assets/images/EmptyChat.png";

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

  if (fetchedChats.length === 0) {
    return (
      <div>
        <div className="flex-1 flex flex-col items-center justify-center absolute top-[50%] left-[50%] translate-x-[-50%] xl:translate-x-[0] translate-y-[-50%] w-full xl:w-fit">
          <img
            src={EmptyChat}
            alt=""
            className="mb-[16px] w-[122px] md:w-[135px] xl:w-[163px]"
          />
          <div className="text-center flex flex-col items-center justify-center gap-[8px]">
            <p className="text-[18px] md:text-[28px] xl:text-[32px] font-[700] text-[#1D1D1F]">
              There are no messages ...
            </p>
            <p className="text-[16px] md:text-[20px] font-[500] text-[#5F5F65] max-w-[450px]">
              Start a conversation with a customer to provide support or answer
              a query.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
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
