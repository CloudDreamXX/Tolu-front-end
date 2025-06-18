import { useState } from "react";

import { MessageSidebar } from "widgets/message-sidebar";
import { ChatItemModel, chatItems } from "./mock";
import { MessageTabs } from "widgets/message-tabs/ui";

export const ContentManagerMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);

  const chatItemClick = (chatItem: ChatItemModel) => {
    if (selectedChat === chatItem) {
      setSelectedChat(null);
    } else {
      setSelectedChat(chatItem);
    }
  };

  return (
    <div className="flex h-full bg-slate-[#DBDEE1] border">
      <MessageSidebar
        chats={chatItems}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
      />
      <MessageTabs chatId={selectedChat?.id} />
    </div>
  );
};
