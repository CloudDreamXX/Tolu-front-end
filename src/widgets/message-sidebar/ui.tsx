import { ChatItemModel } from "entities/chat";
import { ChatItem } from "features/chat-item";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import {
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
        <div className="flex flex-col ">
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
    <aside className="lg:w-[360px] lg:min-w-[360px] border border-[#DBDEE1] border-l-0 flex flex-col w-full ">
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
      <div className="px-4 py-6 pb-0 md:p-6 md:pb-0 lg:p-8 lg:pb-0">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center justify-center text-[24px]  md:text-[20px] font-bold text-[#1D1D1F] gap-2">
            {title}
            {unreadCount > 0 && (
              <span className="w-[24px] h-[24px] md:w-[26px] md:h-[26px] leading-[22px] bg-white border lg:border-2 flex items-center justify-center border-[#1C63DB] text-[15px] md:text-base text-[#1C63DB] rounded-sm">
                {unreadCount}
              </span>
            )}
          </div>
          {onCreateGroup && (
            <button
              className="w-[40px] md:w-[44px] h-[40px] md:h-[44px] rounded-full bg-blue-500 flex items-center justify-center"
              onClick={() => onCreateGroup()}
            >
              <MaterialIcon iconName="add" className="text-white" />
            </button>
          )}
        </div>

        <div className="pb-4 md:pb-6">
          <Input
            placeholder="Search"
            className="rounded-full "
            icon={<MaterialIcon iconName="search" size={16} />}
          />
        </div>
      </div>

      {isLoadingChats ? (
        <SidebarLoadingSkeleton />
      ) : (
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="hidden w-full grid-cols-2 p-0 bg-transparent border-none shadow-none place-items-center">
            <TabsTrigger value="clients" className="text-lg">
              Clients
            </TabsTrigger>
            <TabsTrigger value="coaches" className="text-lg">
              Coaches
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-261px)] md:h-[calc(100vh-302px)] lg:h-[calc(100vh-160px)]">
            <TabsContent value="clients" className="mt-0">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                  <p className="font-semibold">No client conversations</p>
                  <p className="text-sm">
                    Start a conversation with a client to see it here.
                  </p>
                </div>
              ) : (
                chats.map((item) => (
                  <ChatItem
                    key={item.id}
                    item={item}
                    onClick={() => onChatClick(item)}
                    classname={selectedChat?.id === item.id ? "bg-white" : ""}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="coaches" className="hidden mt-0">
              {chats.filter((item) => item.type === "coach").length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                  <p className="font-semibold">No coach conversations</p>
                  <p className="text-sm">
                    You haven’t started chatting with any coach yet.
                  </p>
                </div>
              ) : (
                chats
                  .filter((item) => item.type === "coach")
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
      )}
    </aside>
  );
};
