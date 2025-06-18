import {
  Input,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";
import Inbox from "shared/assets/icons/inbox";

import Search from "shared/assets/icons/search";
import { ChatItemModel, chatItems } from "pages/content-manager";
import { ChatItem } from "widgets/chat-item";

interface MessageSidebarProps {
  chats: ChatItemModel[];
  onChatClick: (chat: ChatItemModel) => void;
  selectedChat: ChatItemModel | null;
}

export const MessageSidebar: React.FC<MessageSidebarProps> = ({
  chats,
  onChatClick,
  selectedChat,
}) => {
  return (
    <aside className="w-[360px] min-w-[360px] border border-[#DBDEE1] border-l-0 flex flex-col">
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center justify-center text-[32px] font-bold text-[#1D1D1F] gap-2">
            <Inbox width={18} height={18} />
            Inbox
            <span className="w-[26px] h-[26px] leading-[22px] bg-white border-2 flex items-center justify-center border-[#1C63DB] text-base text-[#1C63DB] rounded-sm">
              24
            </span>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-blue-500"></div>
        </div>

        <div className="pb-6">
          <Input
            placeholder="Search"
            className="rounded-full "
            icon={<Search />}
          />
        </div>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent border-none shadow-none place-items-center">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <TabsContent value="clients" className="mt-0">
            {chats
              .filter((item) => item.role === "client")
              .map((item) => (
                <ChatItem
                  key={item.id}
                  item={item}
                  onClick={() => onChatClick(item)}
                  classname={selectedChat?.id === item.id ? "bg-white" : ""}
                />
              ))}
          </TabsContent>
          <TabsContent value="coaches" className="mt-0">
            {chats
              .filter((item) => item.role === "coach")
              .map((item) => (
                <ChatItem
                  key={item.id}
                  item={item}
                  onClick={() => onChatClick(item)}
                  classname={selectedChat?.id === item.id ? "bg-white" : ""}
                />
              ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
};
