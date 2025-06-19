import { useState } from "react";

import { usePageWidth } from "shared/lib";
import { MessageSidebar } from "widgets/message-sidebar";
import { MessageTabs } from "widgets/message-tabs/ui";
import { ChatItemModel, chatItems } from "./mock";

export const ContentManagerMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);
  const { isMobileOrTablet } = usePageWidth();

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
        chats={chatItems}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
      />
    );
  }

  return (
    <div className="flex h-full bg-slate-[#DBDEE1] border">
      <MessageSidebar
        chats={chatItems}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
      />
      <MessageTabs
        chatId={selectedChat?.id}
        goBackMobile={() => setSelectedChat(null)}
      />
    </div>
  );
};
