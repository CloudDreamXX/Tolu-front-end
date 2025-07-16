import Inbox from "shared/assets/icons/inbox";
import {
  Input,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";

import { ChatItemModel } from "pages/content-manager";
import Search from "shared/assets/icons/search";
import { ChatItem } from "features/chat-item";

interface MessageSidebarProps {
  chats: ChatItemModel[];
  onChatClick: (chat: ChatItemModel) => void;
  selectedChat: ChatItemModel | null;
  loading?: boolean;
}

export const MessageSidebar: React.FC<MessageSidebarProps> = ({
  chats,
  onChatClick,
  selectedChat,
  loading,
}) => {
  return (
    <aside className="lg:w-[360px] lg:min-w-[360px] border border-[#DBDEE1] border-l-0 flex flex-col w-full ">
      <div className="px-4 py-6 pb-0 md:p-6 md:pb-0 lg:p-8 lg:pb-0">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center justify-center text-[24px] md:text-[32px] font-bold text-[#1D1D1F] gap-2">
            <Inbox width={18} height={18} />
            Inbox
            <span className="w-[24px] h-[24px] md:w-[26px] md:h-[26px] leading-[22px] bg-white border lg:border-2 flex items-center justify-center border-[#1C63DB] text-[15px] md:text-base text-[#1C63DB] rounded-sm">
              24
            </span>
          </div>
          <div className="w-[40px] md:w-[44px] h-[40px] md:h-[44px] rounded-full bg-blue-500"></div>
        </div>

        <div className="pb-4 md:pb-6">
          <Input
            placeholder="Search"
            className="rounded-full "
            icon={<Search />}
          />
        </div>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent border-none shadow-none place-items-center w-[50%]">
          <TabsTrigger value="clients" className="text-lg">
            Clients
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-lg">
            Coaches
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-261px)] md:h-[calc(100vh-302px)] lg:h-[calc(100vh-280px)]">
          <TabsContent value="clients" className="mt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                <p className="font-semibold">Loading client conversations...</p>
              </div>
            ) : chats.filter((item) => item.role === "client").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                <p className="font-semibold">No client conversations</p>
                <p className="text-sm">
                  Start a conversation with a client to see it here.
                </p>
              </div>
            ) : (
              chats
                .filter((item) => item.role === "client")
                .map((item) => (
                  <ChatItem
                    key={item.id}
                    item={item}
                    onClick={() => onChatClick(item)}
                    classname={selectedChat?.id === item.id ? "bg-white" : ""}
                  />
                ))
            )}
          </TabsContent>

          <TabsContent value="coaches" className="mt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                <p className="font-semibold">Loading coach conversations...</p>
              </div>
            ) : chats.filter((item) => item.role === "coach").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                <p className="font-semibold">No coach conversations</p>
                <p className="text-sm">
                  You haven’t started chatting with any coach yet.
                </p>
              </div>
            ) : (
              chats
                .filter((item) => item.role === "coach")
                .map((item) => (
                  <ChatItem
                    key={item.id}
                    item={item}
                    onClick={() => onChatClick(item)}
                    classname={selectedChat?.id === item.id ? "bg-white" : ""}
                  />
                ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
};
