import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

import { DetailsChatItemModel } from "entities/chat";
import { useFetchChatDetailsByIdQuery } from "entities/chat/chatApi";
import { Client, ClientProfile, CoachService } from "entities/coach";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { cn, toast, usePageWidth } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";
import { MultiSelectField } from "widgets/MultiSelectField";
import { SelectedClientModal } from "widgets/SelectedClientModal";
import { ParticipantsModal } from "./components/ParticipantsModal";
import { FilesTab } from "./files-tab";
import { MessagesTab } from "./messages-tab";
import { NotesTab } from "./notes-tab";
import { RecommendedTab } from "./recommended-tab";

interface MessageTabsProps {
  goBackMobile: () => void;
  onEditGroup?: (chat: DetailsChatItemModel) => void;
  onCreateGroup?: (clients?: string[]) => void;
  chatId?: string;
  clientsData?: Client[];
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  chatId,
  goBackMobile,
  clientsData = [],
  onCreateGroup,
  onEditGroup,
}) => {
  const { isMobile, isMobileOrTablet } = usePageWidth();
  const profile = useSelector((state: RootState) => state.user.user);

  const {
    data: chatDetails,
    isLoading,
    isError,
  } = useFetchChatDetailsByIdQuery({ chatId: chatId! }, { skip: !chatId });
  const [chat, setChat] = useState<DetailsChatItemModel | null>(null);

  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("clientInfo");
  const [search, setSearch] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!chatId) return;

      if (chatDetails) {
        if (!cancelled) setChat(chatDetails);
        return;
      }

      if (isError) {
        try {
          const clients = await CoachService.getManagedClients();
          const client = clients.clients.find((c) => c.client_id === chatId);
          if (client && !cancelled) {
            setChat({
              chat_id: chatId,
              name: client.name,
              avatar_url: "",
              chat_type: "new_chat",
              last_message_at: "",
              unread_count: 0,
              last_message: {} as any,
              participants: [
                {
                  user: {
                    user_id: client.client_id,
                    email: "",
                    name: client.name,
                  },
                } as any,
              ],
              description: "",
              created_by: "",
              created_at: "",
              updated_at: "",
            });
          }
        } catch {
          toast({
            title: "Error",
            description: "Failed to load chat details. Please try again.",
            variant: "destructive",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chatId, chatDetails, isError]);

  const handleSelectClient = async (clientId: string | undefined) => {
    if (!clientId) {
      return;
    }

    try {
      const fullClient = await CoachService.getClientProfile(clientId);
      setSelectedClient(fullClient);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Failed to load client profile",
        description: "Failed to load client profile. Please try again." + e,
      });
    }
  };

  const onSaveClients = () => {
    if (selectedOption.length < 2) {
      toast({
        variant: "destructive",
        title: "No clients selected",
        description: "Please select at least two clients.",
      });
    } else {
      onCreateGroup?.(selectedOption);
    }
  };

  const receiver = useMemo(
    () => chat?.participants?.find((p) => p.user.email !== profile?.email),
    [chat, profile?.email]
  );
  const isClient = profile?.roleName === "Client";

  if (!chatId)
    return (
      <main className="w-full p-8">
        <div className="flex gap-2">
          <MaterialIcon iconName="person" />
          <span className="text-xl font-bold">Add Client(s)</span>
        </div>
        <MultiSelectField
          className="mt-4 md:rounded-sm"
          options={clientsData.map((c) => ({
            label: c.name,
          }))}
          selected={selectedOption}
          onChange={setSelectedOption}
          onSave={onSaveClients}
        />
      </main>
    );

  if (isLoading) return <MessageTabsLoadingSkeleton />;
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
                <MaterialIcon iconName="keyboard_arrow_left" />
              </Button>
            )}
            <div className="relative mr-3">
              <Avatar className="w-10 h-10 ">
                <AvatarImage src={chat.avatar_url} />
                <AvatarFallback className="bg-slate-300">
                  {receiver?.user.name.slice(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[18px] text-[#1D1D1F]">
                {chat.name || receiver?.user.name || "Unknown name"}
              </span>
              <span className="font-semibold text-muted-foreground text-[14px]">
                @{chat.description || receiver?.user.email || "Unknown email"}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-3",
              isClient ? "lg:w-[360px] hidden md:flex" : undefined
            )}
          >
            {isClient ? (
              <div className="hidden w-full lg:block">
                <Input
                  placeholder="Search"
                  icon={<MaterialIcon iconName="search" size={16} />}
                  className="rounded-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            ) : (
              <>
                {!isMobile && chat.chat_type !== "group" && (
                  <Button
                    onClick={() => handleSelectClient(receiver?.user.id)}
                    variant="blue2"
                  >
                    View Profile
                  </Button>
                )}

                {!isMobile && chat.chat_type === "group" && (
                  <Button
                    variant="ghost"
                    className="p-2 bg-white border hover:bg-white"
                    onClick={() => setParticipantsModalOpen(true)}
                  >
                    <div className="flex items-center">
                      {chat.participants.slice(0, 3).map((p, i) => (
                        <Avatar
                          key={p.user.id}
                          className={cn(
                            "ring-1 ring-black/5 border-white rounded-full shadow-sm w-6 h-6 -ml-1 border-[1.5px]",
                            i === 0 && "ml-0"
                          )}
                        >
                          <AvatarImage src={undefined} alt={"undefined"} />
                          <AvatarFallback className="text-[10px] font-medium">
                            {p.user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {chat.participants.length}
                    </span>
                  </Button>
                )}
              </>
            )}

            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-none rounded-full hover:bg-white w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
                >
                  <MaterialIcon iconName="more_vert" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isMobile && (
                  <DropdownMenuItem className="text-[#1D1D1F]">
                    <MaterialIcon iconName="person" className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                )}
                {!isClient && chat.chat_type === "group" && (
                  <DropdownMenuItem
                    className="text-[#1D1D1F]"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onEditGroup?.(chat);
                    }}
                  >
                    <MaterialIcon iconName="edit" className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-600">
                  <MaterialIcon iconName="delete" className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isClient && (
          <div className="hidden my-4 sm:block lg:hidden">
            <Input
              placeholder="Search"
              icon={<MaterialIcon iconName="search" size={16} />}
              className="rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      <Tabs defaultValue="messages">
        <TabsList className="border-b border-[#DBDEE1] w-full justify-start">
          <TabsTrigger value="messages" className="w-[120px]">
            {isClient ? "Chat" : "Messages"}
          </TabsTrigger>
          <TabsTrigger value="files" className="w-[120px]">
            Files
          </TabsTrigger>
          {!isClient && (
            <TabsTrigger value="notes" className="w-[fit]">
              Notes
            </TabsTrigger>
          )}
          {isClient && (
            <TabsTrigger value="recommended" className="w-[fit]">
              Recommended for you
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="messages">
          <MessagesTab chat={chat} search={search} />
        </TabsContent>
        <TabsContent value="files">
          <FilesTab chatId={chatId} />
        </TabsContent>
        <TabsContent value="recommended">
          <RecommendedTab />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab chat={chat} search={search} />
        </TabsContent>
      </Tabs>

      {selectedClient && (
        <SelectedClientModal
          clientId={selectedClient.client_info.id}
          onClose={() => {
            setSelectedClient(null);
          }}
          onEdit={() => {}}
          onDelete={() => {}}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      <ParticipantsModal
        open={participantsModalOpen}
        onClose={() => setParticipantsModalOpen(false)}
        participants={chat.participants || []}
      />
    </main>
  );
};

const MessageTabsLoadingSkeleton = () => {
  return (
    <main className="flex flex-col w-full h-[calc(100vh-78px)] px-4 py-6 md:p-6 lg:p-8 animate-pulse">
      {/* Header: Avatar and Name */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-full skeleton-gradient" />
          <div className="flex flex-col gap-2">
            <div className="w-28 h-[10px] rounded-[24px] skeleton-gradient" />
            <div className="w-20 h-[10px] rounded-[24px] skeleton-gradient" />
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="bg-[#D6ECFD] p-[16px] rounded-full">
            <div className="w-16 h-[10px] rounded-[24px] bg-[#AAC6EC]" />
          </div>
          <MaterialIcon iconName="more_vert" />
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
        <div className="flex flex-col flex-1 gap-8 py-6">
          {/* Divider line */}
          <div className="w-full border-t border-[#DBDEE1]">
            <div className="w-[80px] h-[6px] rounded-[24px] skeleton-gradient mx-auto mt-[-3px]" />
          </div>

          {/* Message from left */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 rounded-full skeleton-gradient" />
              <div className="flex flex-col gap-2">
                <div className="w-28 h-[10px] rounded-[24px] skeleton-gradient" />
                <div className="w-20 h-[10px] rounded-[24px] skeleton-gradient" />
              </div>
            </div>
            <div className="w-[45%] h-[10px] rounded-[24px] skeleton-gradient" />
            <div className="w-[35%] h-[10px] rounded-[24px] skeleton-gradient" />
          </div>

          {/* Message from right */}
          <div className="flex flex-col items-end justify-end gap-2">
            <div className="flex items-center">
              <div className="flex flex-col items-end gap-2">
                <div className="w-28 h-[10px] rounded-[24px] skeleton-gradient" />
                <div className="w-20 h-[10px] rounded-[24px] skeleton-gradient" />
              </div>
              <div className="w-10 h-10 ml-3 rounded-full skeleton-gradient" />
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
              <MaterialIcon iconName="add" />
              <MaterialIcon iconName="sentiment_satisfied" />
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
