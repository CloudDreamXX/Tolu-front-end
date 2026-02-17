import { ChatItemModel } from "entities/chat";
import { ChatItem } from "features/chat-item";
import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import {
  Button,
  Input,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";

interface MessageSidebarProps {
  chats: ChatItemModel[];
  isLoadingChats: boolean;
  selectedChat: ChatItemModel | null;
  onChatClick: (chat: ChatItemModel) => void;
  onCreateGroup?: (clients?: string[]) => void;
  title?: string;
}

export const MessageSidebar: React.FC<MessageSidebarProps> = ({
  chats,
  isLoadingChats,
  selectedChat,
  onChatClick,
  onCreateGroup,
  title = "Inbox",
}) => {
  const [search, setSearch] = useState("");
  const unreadCount = chats.reduce((count, chat) => {
    return count + (chat.unreadCount || 0);
  }, 0);

  const SidebarLoadingSkeleton = () => {
    return (
      <div>
        <div className="flex items-center gap-[44px] justify-between p-[16px]">
          <div className="w-full h-[10px] rounded-[24px] skeleton-gradient" />
          <div className="w-full h-[10px] rounded-[24px] skeleton-gradient" />
        </div>
        <div className="flex flex-col">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-[16px] p-[16px] border-b border-[#DBDEE1]"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-[40px] h-[40px] rounded-full skeleton-gradient flex-shrink-0" />
                  <div className="flex flex-col gap-[6px] w-full min-w-[150px]">
                    <div className="w-[80%] h-[10px] rounded-[24px] skeleton-gradient" />
                    <div className="w-[40%] h-[10px] rounded-[24px] skeleton-gradient" />
                  </div>
                </div>
                <div className="w-[33px] h-[10px] rounded-[24px] skeleton-gradient" />
              </div>
              <div className="flex flex-col gap-[16px]">
                <div className="w-[100%] h-[10px] rounded-[24px] skeleton-gradient" />
                <div className="w-[60%] h-[10px] rounded-[24px] skeleton-gradient" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="flex flex-col w-[116px] overflow-x-hidden p-[24px] overflow-y-auto h-screen">
      {isLoadingChats && (
        <div className="xl:hidden flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <MaterialIcon
              iconName="progress_activity"
              className="text-blue-600 animate-spin"
            />
          </span>
          Please wait, we are loading the information...
        </div>
      )}

      {isLoadingChats ? (
        <SidebarLoadingSkeleton />
      ) : (
        <Tabs defaultValue="clients" className="w-fit h-full">
          <ScrollArea className="h-full bg-white rounded-[16px] w-fit pt-[16px]">
            <TabsContent value="clients" className="mt-0">
              {chats.filter(item => {
                if (item.name && typeof item.name === "string") {
                  return item.name.toLowerCase().includes(search.toLowerCase());
                }
                return item.participants.some(p =>
                  (p.first_name && p.first_name.toLowerCase().includes(search.toLowerCase())) ||
                  (p.last_name && p.last_name.toLowerCase().includes(search.toLowerCase())) ||
                  (p.name && p.name.toLowerCase().includes(search.toLowerCase()))
                );
              }).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                  <p className="font-semibold">No client conversations</p>
                  <p className="text-sm">
                    Start a conversation with a client to see it here.
                  </p>
                </div>
              ) : (
                chats
                  .filter(item => {
                    if (item.name && typeof item.name === "string") {
                      return item.name.toLowerCase().includes(search.toLowerCase());
                    }
                    return item.participants.some(p =>
                      (p.first_name && p.first_name.toLowerCase().includes(search.toLowerCase())) ||
                      (p.last_name && p.last_name.toLowerCase().includes(search.toLowerCase())) ||
                      (p.name && p.name.toLowerCase().includes(search.toLowerCase()))
                    );
                  })
                  .map((item) => (
                    <ChatItem
                      key={item.id}
                      item={item}
                      onClick={() => onChatClick(item)}
                      classname={selectedChat?.id === item.id ? "bg-[#1C63DB] opacity-[70%] text-white" : ""}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="coaches" className="hidden mt-0">
              {chats.filter((item) => item.type === "coach" && item.name && item.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                  <p className="font-semibold">No coach conversations</p>
                  <p className="text-sm">
                    You haven’t started chatting with any coach yet.
                  </p>
                </div>
              ) : (
                chats
                  .filter((item) => item.type === "coach" && item.name && item.name.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => (
                    <ChatItem
                      key={item.id}
                      item={item}
                      onClick={() => onChatClick(item)}
                      classname={selectedChat?.id === item.id ? "bg-[#1C63DB] opacity-[70%] text-white" : ""}
                    />
                  ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </aside>
  );
};
