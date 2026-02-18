
import { ChatItemModel } from "entities/chat";
import { ChatItem, timeAgo } from "features/chat-item";
import { Popover, PopoverTrigger, PopoverContent } from "shared/ui";
import { useState } from "react";
import { ScrollArea } from "shared/ui";
import { Dock, DockIcon } from "shared/ui/dock";

function SidebarClientPopover({ item, onClick, selected }: { item: ChatItemModel; onClick: () => void; selected: boolean }) {
  const [open, setOpen] = useState(false);

  const name = item?.participants?.[0]?.first_name ? `${item.participants[0].first_name} ${item.participants[0].last_name}` : item?.participants?.[0]?.name ? item.participants[0].name : item.name;
  const email = item.participants?.[0]?.email;
  const lastActivity = item.lastMessageAt;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <ChatItem
            item={item}
            onClick={onClick}
            classname={selected ? "bg-[#1C63DB] opacity-[70%] text-white" : ""}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" arrow={false} sideOffset={8} className="min-w-[195px] max-w-[350px] border-none">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-base text-black">{name}</div>
          <div className="text-sm text-[#5F5F65]">{email}</div>
          <div className="text-sm text-[#5F5F65]">Last activity: {lastActivity ? timeAgo(lastActivity) : "—"}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface MessageSidebarProps {
  chats: ChatItemModel[];
  isLoadingChats: boolean;
  selectedChat: ChatItemModel | null;
  onChatClick: (item: ChatItemModel) => void;
  onCreateGroup?: (clients?: string[]) => void;
  title?: string;
}

export const MessageSidebar: React.FC<MessageSidebarProps> = ({
  chats,
  isLoadingChats,
  selectedChat,
  onChatClick,
}) => {
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

  // Pagination logic for sidebar Dock
  const DOCK_PAGE_SIZE = 15;
  const [dockPage, setDockPage] = useState(0);
  const totalPages = Math.ceil(chats.length / DOCK_PAGE_SIZE);
  const paginatedChats = chats.slice(dockPage * DOCK_PAGE_SIZE, (dockPage + 1) * DOCK_PAGE_SIZE);

  return (
    <aside className="flex flex-col w-full lg:w-[116px] overflow-x-hidden p-[24px] overflow-y-auto h-[calc(100vh-65px)]">
      {isLoadingChats && (
        <div className="xl:hidden flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </span>
          Please wait, we are loading the information...
        </div>
      )}

      {isLoadingChats ? (
        <SidebarLoadingSkeleton />
      ) : (
        <ScrollArea className="h-full bg-white rounded-[16px] w-full lg:w-fit overflow-y-auto scrollbar-hidden">
          <Dock className="relative h-full flex flex-col border-none mt-0 p-[16px] rounded-[16px]" iconSize={40} iconMagnification={60} iconDistance={100}>
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                <p className="font-semibold">No conversations</p>
                <p className="text-sm">
                  Start a conversation with a client to see it here.
                </p>
              </div>
            ) : (
              paginatedChats.map((item) => (
                <DockIcon size={40} magnification={60} distance={100} key={item.id}>
                  <SidebarClientPopover
                    item={item}
                    onClick={() => onChatClick(item)}
                    selected={selectedChat?.id === item.id}
                  />
                </DockIcon>
              ))
            )}
          </Dock>
          {totalPages > 1 && (
            <button
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 bg-white border shadow-md rounded-b-[16px] w-full p-1 mt-2 flex items-center justify-center"
              onClick={() => setDockPage((prev) => (prev + 1) % totalPages)}
              aria-label="Next chat page"
              type="button"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
        </ScrollArea>
      )}
    </aside>
  );
};
