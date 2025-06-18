import { MoreVertical, Trash2 } from "lucide-react";
import { ChatItemModel, chatItems } from "pages/content-manager";
import { useEffect, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "shared/ui";
import { MessagesTab } from "./messages-tab";
import { NotesTab } from "./notes-tab";
import { TemplatesTab } from "./templates-tab";
import { messages } from "./messages-tab/mock";
import { MessageBubble } from "widgets/message-bubble";

interface MessageTabsProps {
  chatId?: string;
}

export const MessageTabs: React.FC<MessageTabsProps> = ({ chatId }) => {
  const [chat, setChat] = useState<ChatItemModel | null>();

  useEffect(() => {
    //mock logic
    const result = chatItems.find((e) => e.id === chatId);
    console.log(result);

    setChat(result);
  }, [chatId]);

  if (!chat) return null;

  return (
    <main className="flex flex-col w-full h-full p-8">
      <div className="flex flex-col border-x-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center ">
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
            <Button variant="blue2">View Profile</Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-none rounded-full hover:bg-white"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          <MessagesTab chatId={chatId} />
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
