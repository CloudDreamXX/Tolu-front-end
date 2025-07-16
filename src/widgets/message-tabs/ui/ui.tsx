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

  useEffect(() => {
    //mock logic
    const result = chatItems.find((e) => e.id === chatId);
    setChat(result);
  }, [chatId]);

  if (!chat) return null;

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
