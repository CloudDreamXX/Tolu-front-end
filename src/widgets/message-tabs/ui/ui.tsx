import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

import {
  ChatMessageModel,
  DetailsChatItemModel,
  FetchChatMessagesResponse,
} from "entities/chat";
import { useFetchChatDetailsByIdQuery } from "entities/chat/api";
import { upsertChat } from "entities/chat/chatsSlice";
import {
  Client,
  ClientProfile,
  useGetClientCoachesQuery,
  useGetManagedClientsQuery,
  useLazyGetClientProfileQuery,
} from "entities/coach";
import { RootState } from "entities/store";
import { useDispatch, useSelector } from "react-redux";
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
import { useLocation } from "react-router-dom";
import { ClientComprehensiveSummary } from "widgets/ClientComprehensiveSummary";
import { MedicationsTab } from "./medications-tab";
import { SupplementsTab } from "./supplements-tab";
import { CoachDailyJournal } from "./journals-tab";

type TabItem = {
  id: string;
  label: string;
  requiresFiles?: boolean;
  requiresNotes?: boolean;
  requiresRecommended?: boolean;
};

const ALL_TABS: TabItem[] = [
  { id: "profile", label: "Case" },
  { id: "messages", label: "Messages" },
  { id: "notes", label: "Notes", requiresNotes: true },
  { id: "files", label: "Files", requiresFiles: true },
  { id: "labs", label: "Labs" },
  { id: "providers", label: "Providers" },
  { id: "biometrics", label: "Biometrics" },
  { id: "journals", label: "Journals" },
  { id: "research", label: "Research" },
  { id: "plan", label: "Action plan" },
  { id: "medications", label: "Medications" },
  { id: "supplements", label: "Supplements" },
  {
    id: "recommended",
    label: "Recommended for you",
    requiresRecommended: true,
  },
];

const CLIENT_TABS: TabItem[] = [
  { id: "messages", label: "Chat" },
  { id: "files", label: "Files", requiresFiles: true },
  {
    id: "recommended",
    label: "Recommended for you",
    requiresRecommended: true,
  },
];

interface MessageTabsProps {
  goBackMobile: () => void;
  onEditGroup?: (chat: DetailsChatItemModel) => void;
  onCreateGroup?: (clients?: string[]) => void;
  chatId?: string;
  clientsData?: Client[];
  sendMessage: (content: string) => Promise<ChatMessageModel | undefined>;
  loadMessages: (
    page: number,
    pageSize?: number
  ) => Promise<FetchChatMessagesResponse | undefined>;
  showAddClient?: boolean;
  hideFiles?: boolean;
  hideNotes?: boolean;
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  chatId,
  goBackMobile,
  clientsData = [],
  onCreateGroup,
  onEditGroup,
  sendMessage,
  loadMessages,
  showAddClient = true,
  hideFiles = false,
  hideNotes = false,
}) => {
  const { isMobile, isMobileOrTablet } = usePageWidth();
  const profile = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const {
    refetch,
    data: chatDetails,
    isLoading,
    isError,
  } = useFetchChatDetailsByIdQuery(chatId!, {
    skip: !chatId,
    refetchOnMountOrArgChange: true,
  });

  const { data: clients } = useGetManagedClientsQuery();
  const [getClientProfile] = useLazyGetClientProfileQuery();

  const [chat, setChat] = useState<DetailsChatItemModel | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("healthProfile");
  const [search, setSearch] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [pinnedTabs, setPinnedTabs] = useState<string[]>([
    "profile",
    "messages",
    "notes",
    "files",
  ]);

  const isClient = profile?.roleName === "Client";

  const pinned = new Set(pinnedTabs);

  const availableTabs = useMemo(() => {
    if (isClient) {
      return CLIENT_TABS.filter((tab) => {
        if (tab.requiresFiles && hideFiles) return false;
        return true;
      });
    }

    return ALL_TABS.filter((tab) => {
      if (tab.requiresFiles && hideFiles) return false;
      if (tab.requiresNotes && hideNotes) return false;
      if (tab.requiresRecommended && !isClient) return false;
      return true;
    });
  }, [isClient, hideFiles, hideNotes]);

  const visibleTabs = isClient
    ? availableTabs
    : availableTabs.filter((t) => pinned.has(t.id));

  const overflowTabs = isClient
    ? []
    : availableTabs.filter((t) => !pinned.has(t.id));

  const location = useLocation();

  const defaultTab = location.state?.id ?? "messages";

  useEffect(() => {
    if (!chatId) {
      setChat(null);
      setSelectedClient(null);
      setActiveTab("clientInfo");
      setSearch("");
      setSelectedOption([]);
    }
  }, [chatId]);

  useEffect(() => {
    const initasync = async () => {
      if (!chatId) return;

      if (chatDetails) {
        setChat(chatDetails.data);
        return;
      }

      if (isError) {
        try {
          const client =
            clients && clients.data.clients
              ? clients.data.clients.find((c) => c.client_id === chatId)
              : undefined;
          if (client) {
            dispatch(
              upsertChat({
                id: client.client_id,
                type: "new_chat",
                lastMessageAt: "",
                unreadCount: 0,
                lastMessage: null,
                name: client.name,
                avatar_url: "",
                participants: [
                  {
                    id: client.client_id,
                    email: "",
                    name: client.name,
                    first_name: client.first_name,
                    last_name: client.last_name,
                  },
                ],
              })
            );
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
                    first_name: client.first_name,
                    last_name: client.last_name,
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
    };

    initasync();
  }, [chatId, chatDetails, isError]);

  const handleSelectClient = async (clientId: string | undefined) => {
    if (!clientId) {
      return;
    }

    try {
      const { data: fullClient } = await getClientProfile(clientId);
      setSelectedClient(fullClient?.data ?? null);
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

  const receiverUserId = receiver?.user?.id;

  const { data: clientCoaches } = useGetClientCoachesQuery(receiverUserId!, {
    skip: !receiverUserId,
  });

  if (!chatId && showAddClient)
    return (
      <main className="w-full p-8">
        <div className="flex gap-2">
          <MaterialIcon iconName="person" />
          <span className="text-xl font-bold">Add Client(s)</span>
        </div>
        <MultiSelectField
          className="mt-[4px] md:rounded-sm"
          options={clientsData.map((c) => ({
            label:
              c.first_name && c.last_name
                ? `${c.first_name} ${c.last_name}`
                : c.first_name || c.name,
          }))}
          selected={selectedOption}
          onChange={setSelectedOption}
          onSave={onSaveClients}
        />
      </main>
    );

  const initials = (() => {
    if (chat?.name) {
      return chat.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("")
    }

    const user = receiver?.user;
    if (!user) return "UN";

    if (user.first_name && user.last_name) {
      return (
        `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
        "UN"
      );
    }

    if (user.first_name) {
      return (user.first_name.slice(0, 2) || "UN").toUpperCase();
    }

    if (user.name) {
      const parts = user.name.trim().split(" ").filter(Boolean);
      if (parts.length > 1) {
        return (
          parts
            .map((p) => p[0]?.toUpperCase() ?? "")
            .slice(0, 2)
            .join("") || "UN"
        );
      }
      return (parts[0]?.slice(0, 2) || "UN").toUpperCase();
    }

    return "UN";
  })();

  if (isLoading) return <MessageTabsLoadingSkeleton />;
  if (!chat) return null;

  return (
    <main className="flex flex-col w-full h-full px-4 py-6 md:p-6 lg:p-8 min-h-screen">
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
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[18px] text-[#1D1D1F]">
                {chat.name ||
                  (receiver?.user.first_name &&
                    receiver?.user.last_name &&
                    `${receiver?.user.first_name} ${receiver?.user.last_name}`) ||
                  receiver?.user.name ||
                  "Unknown name"}
              </span>
              <span className="font-semibold text-muted-foreground text-[14px]">
                {chat.description || receiver?.user.email || ""}
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
                {/* {!isMobile && chat.chat_type !== "group" && (
                  <Button
                    onClick={() => handleSelectClient(receiver?.user.id)}
                    variant="blue2"
                  >
                    View Profile
                  </Button>
                )} */}

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
                            {`${p.user.first_name.slice(0, 1).toUpperCase()}${p.user.last_name.slice(0, 1).toUpperCase()}`}
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

            {(isMobile || (!isClient && chat.chat_type === "group")) && (
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
                    <DropdownMenuItem
                      className="text-[#1D1D1F]"
                      onClick={() => handleSelectClient(receiver?.user.id)}
                    >
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
                  {/* <DropdownMenuItem className="text-red-600">
                  <MaterialIcon iconName="delete" fill={1} className="mr-2" />
                  Delete
                </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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

      <Tabs defaultValue={defaultTab}>
        <TabsList className="border-b w-full justify-start items-center overflow-x-auto overflow-y-hidden">
          {visibleTabs.map((tab) => (
            <div key={tab.id} className="relative group">
              <TabsTrigger value={tab.id} className="min-w-[120px]">
                {tab.id === "messages" && isClient ? "Chat" : tab.label}
              </TabsTrigger>

              {!isClient && (
                <Button
                  size="icon"
                  variant="unstyled"
                  className="absolute z-50 hover:bg-transparent text-[#737373] hover:text-black rounded-full p-[1px] -right-3 -top-2
               opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPinnedTabs((prev) => {
                      if (prev.length <= 3) {
                        return prev;
                      }
                      return prev.filter((id) => id !== tab.id);
                    });
                  }}
                >
                  <MaterialIcon iconName="close" size={14} />
                </Button>
              )}
            </div>
          ))}

          {!isClient && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="unstyled">
                  <MaterialIcon iconName="more_vert" className="rotate-90" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="bg-[#F2F4F6] border p-2 shadow-lg"
              >
                {overflowTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <TabsTrigger
                      value={tab.id}
                      className="flex-1 justify-start rounded-none"
                    >
                      {tab.label}
                    </TabsTrigger>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinnedTabs((prev) => [...prev, tab.id]);
                      }}
                    >
                      <MaterialIcon iconName="push_pin" size={16} />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TabsList>

        <TabsContent value="profile">
          <ClientComprehensiveSummary
            onOpenChange={() => { }}
            clientId={receiver?.user.id || location.pathname.split("/").pop()!}
            asDialog={false}
          />
        </TabsContent>
        <TabsContent value="messages">
          <MessagesTab
            refetch={refetch}
            chat={chat}
            search={search}
            sendMessage={sendMessage}
            loadMessages={loadMessages}
          />
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
        <TabsContent value="medications">
          <MedicationsTab chat={chat} search={search} />
        </TabsContent>
        <TabsContent value="supplements">
          <SupplementsTab chat={chat} search={search} />
        </TabsContent>
        <TabsContent value="providers">
          {clientCoaches && clientCoaches.data.coaches.length ? (
            <ul className="p-2">
              {clientCoaches.data.coaches.map((c: any) => {
                return (
                  <li
                    key={c.coach_id}
                    className="p-3 mb-5 shadow-sm rounded-xl bg-white border border-gray-200 flex flex-col gap-[4px]"
                  >
                    <div className="truncate font-medium text-[14px]">
                      Name: {c.name}
                    </div>
                    <div className="truncate font-medium text-[14px]">
                      Email: {c.email}
                    </div>
                    <div className="truncate font-medium text-[14px] text-[#737373]">
                      Managed since:{" "}
                      {new Date(c.managed_since).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              No providers yet.
            </div>
          )}
        </TabsContent>
        <TabsContent value="journals">
          <CoachDailyJournal
            clientId={receiver?.user.id || location.pathname.split("/").pop()!}
          />
        </TabsContent>
      </Tabs>

      {selectedClient && (
        <SelectedClientModal
          clientId={selectedClient.client_info.id}
          onClose={() => {
            setSelectedClient(null);
          }}
          onEdit={() => { }}
          onDelete={() => { }}
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
