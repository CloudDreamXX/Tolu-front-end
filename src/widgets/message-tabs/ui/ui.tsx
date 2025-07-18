import { MoreVertical, Trash2 } from "lucide-react";
import { ChatItemModel, chatItems } from "pages/content-manager";
import { useEffect, useState } from "react";
import ArrowLeft from "shared/assets/icons/arrowLeft";

import User from "shared/assets/icons/user";
import { usePageWidth } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";
import { MessagesTab } from "./messages-tab";
import { NotesTab } from "./notes-tab";
import { TemplatesTab } from "./templates-tab";
import Plus from "shared/assets/icons/plus";
import Smiley from "shared/assets/icons/smiley";

interface MessageTabsProps {
  chatId?: string;
  goBackMobile: () => void;
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  chatId,
  goBackMobile,
}) => {
  const [chat, setChat] = useState<ChatItemModel | null>();
  const { isMobile, isMobileOrTablet } = usePageWidth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    const timeout = setTimeout(() => {
      const result = chatItems.find((e) => e.id === chatId);
      setChat(result || null);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [chatId]);

  if (!chat) return null;

  const MessageTabsLoadingSkeleton = () => {
    return (
      <main className="flex flex-col w-full h-[calc(100vh-78px)] px-4 py-6 md:p-6 lg:p-8 animate-pulse">
        {/* Header: Avatar and Name */}
        <div className="flex items-center justify-between mb-[16px]">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full skeleton-gradient mr-3" />
            <div className="flex flex-col gap-2">
              <div className="w-28 h-[10px] rounded-[24px] skeleton-gradient" />
              <div className="w-20 h-[10px] rounded-[24px] skeleton-gradient" />
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="bg-[#D6ECFD] p-[16px] rounded-full">
              <div className="w-16 h-[10px] rounded-[24px] bg-[#AAC6EC]" />
            </div>
            <MoreVertical />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 py-[8px] mb-4 w-full border-b border-[#DBDEE1]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[120px] h-[10px] rounded-[24px] skeleton-gradient"
            />
          ))}
        </div>

        {/* Chat Body */}
        <div className="mt-auto">
          <div className="flex-1 flex flex-col gap-8 py-6">
            {/* Divider line */}
            <div className="w-full border-t border-[#DBDEE1]">
              <div className="w-[80px] h-[6px] rounded-[24px] skeleton-gradient mx-auto mt-[-3px]" />
            </div>

            {/* Message from left */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full skeleton-gradient mr-3" />
                <div className="flex flex-col gap-2">
                  <div className="w-28 h-[10px] rounded-[24px] skeleton-gradient" />
                  <div className="w-20 h-[10px] rounded-[24px] skeleton-gradient" />
                </div>
              </div>
              <div className="w-[45%] h-[10px] rounded-[24px] skeleton-gradient" />
              <div className="w-[35%] h-[10px] rounded-[24px] skeleton-gradient" />
            </div>

            {/* Message from right */}
            <div className="flex justify-end items-end flex-col gap-2">
              <div className="flex items-center">
                <div className="flex flex-col items-end gap-2">
                  <div className="w-28 h-[10px] rounded-[24px] skeleton-gradient" />
                  <div className="w-20 h-[10px] rounded-[24px] skeleton-gradient" />
                </div>
                <div className="w-10 h-10 rounded-full skeleton-gradient ml-3" />
              </div>
              <div className="w-[45%] h-[10px] rounded-[24px] skeleton-gradient" />
              <div className="w-[35%] h-[10px] rounded-[24px] skeleton-gradient" />
              <div className="w-[20%] h-[10px] rounded-[24px] skeleton-gradient" />
            </div>
          </div>

          {/* Input area */}
          <div className="w-full rounded-lg border border-[#DBDEE1] p-4 mt-auto pt-6">
            <div className="w-[40%] mb-2 h-[10px] rounded-[24px] skeleton-gradient" />
            <div className="w-[60%] h-[10px] rounded-[24px] skeleton-gradient" />
            <div className="flex items-end justify-between mt-[24px]">
              <div className="flex items-center gap-[16px]">
                <Plus />
                <Smiley />
              </div>
              <div className="bg-[#1C63DB] p-[16px] rounded-full">
                <div className="w-[92px] h-[10px] rounded-[24px] bg-[#AAC6EC]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  };

  if (loading) return <MessageTabsLoadingSkeleton />;

  return (
    <main className="flex flex-col w-full h-full px-4 py-6 md:p-6 lg:p-8">
      <div className="flex flex-col border-x-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center ">
            {isMobileOrTablet && (
              <Button
                variant="ghost"
                className="p-1 mr-3"
                onClick={goBackMobile}
              >
                <ArrowLeft width={24} height={24} />
              </Button>
            )}
            <div className="relative mr-3">
              <Avatar className="w-10 h-10 ">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-slate-300">AF</AvatarFallback>
              </Avatar>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[18px] text-[#1D1D1F]">
                {chat.name}
              </span>
              <span className="font-semibold text-muted-foreground text-[14px]">
                {chat.username}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isMobile && <Button variant="blue2">View Profile</Button>}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-none rounded-full hover:bg-white w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isMobile && (
                  <DropdownMenuItem className="text-[#1D1D1F]">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="messages">
        <TabsList className="border-b border-[#DBDEE1] w-full justify-start">
          <TabsTrigger value="messages" className="w-[120px]">
            Messages
          </TabsTrigger>
          <TabsTrigger value="notes" className="w-[120px]">
            Notes
          </TabsTrigger>
          <TabsTrigger value="templates" className="w-[120px]">
            Templates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          <MessagesTab chat={chat} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab chatId={chatId} />
        </TabsContent>
        <TabsContent value="templates">
          <TemplatesTab chatId={chatId} />
        </TabsContent>
      </Tabs>
    </main>
  );
};
