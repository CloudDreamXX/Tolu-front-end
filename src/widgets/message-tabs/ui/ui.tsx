import { useCallback, useEffect, useMemo, useState } from "react";
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
import { SelectedClientModal } from "widgets/SelectedClientModal";
import { ClientComprehensiveSummary } from "widgets/ClientComprehensiveSummary";
import { ParticipantsModal } from "./components/ParticipantsModal";
import { FilesTab } from "./files-tab";
import { NotesTab } from "./notes-tab";
import { OverviewTab } from "./overview-tab";
import { RecommendedTab } from "./recommended-tab";
import { SharedContentTab } from "./shared-content-tab";
import { useLocation, useNavigate } from "react-router-dom";
import { MedicationsTab } from "./medications-tab";
import { SupplementsTab } from "./supplements-tab";
import { CoachDailyJournal } from "./journals-tab";
import { useGetCoachClientHealthHistoryQuery } from "entities/health-history";
import {
  CANCER,
  CARDIOVASCULAR,
  GASTROINTESTINAL,
  GENITAL_URINARY,
  HORMONES_METABOLIC,
  IMMUNE_INFLAMMATORY,
  MISCELLANEOUS,
  MUSCULOSKELETAL,
  NEUROLOGIC_MOOD,
  RESPIRATORY,
  SKIN,
} from "widgets/health-profile-form/ui/medical-history-step/lib";
import { MessagesTab } from "./messages-tab";

type TabItem = {
  id: string;
  label: string;
  requiresFiles?: boolean;
  requiresNotes?: boolean;
  requiresRecommended?: boolean;
};

const ALL_TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "intake", label: "Intake" },
  { id: "journal", label: "Journal" },
  { id: "labs", label: "Labs" },
  { id: "protocols", label: "Protocols" },
  { id: "files", label: "Files", requiresFiles: true },
  { id: "collaborations", label: "Collaborations" },
  { id: "notes", label: "Notes", requiresNotes: true },
  { id: "medications", label: "Medications" },
  { id: "supplements", label: "Supplements" },
  { id: "shared-content", label: "Shared content" },
  {
    id: "recommended",
    label: "Recommended for you",
    requiresRecommended: true,
  },
];

const MORE_MENU_TAB_IDS = new Set([
  "medications",
  "supplements",
  "shared-content",
]);

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
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const normalizeTabId = (tab?: string) => {
  if (!tab) return tab;
  return tab === "profile" ? "overview" : tab;
};

const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const getYesConditionLabels = (
  data: Record<string, any> | undefined,
  items: Array<{ label: string; name: string }>
) => {
  if (!data) return [];

  return items
    .filter(({ name }) => {
      const condition = data[toSnakeCase(name)];
      return condition?.status === "yes";
    })
    .map(({ label }) => label);
};

export const MessageTabs: React.FC<MessageTabsProps> = ({
  chatId,
  goBackMobile,
  onEditGroup,
  sendMessage,
  loadMessages,
  hideFiles = false,
  hideNotes = false,
  activeTab: controlledActiveTab,
  setActiveTab: controlledSetActiveTab,
}) => {
  const { isMobile, isMobileOrTablet } = usePageWidth();
  const profile = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryTab = useMemo(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    return normalizeTabId(tab || undefined);
  }, [location.search]);

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
  const [healthProfileClientId, setHealthProfileClientId] = useState<
    string | null
  >(null);
  const isClient = profile?.roleName === "Client";
  const [internalActiveTab, setInternalActiveTab] = useState<string>(() => {
    return queryTab ?? (isClient ? "messages" : "overview");
  });
  const isControlled =
    controlledActiveTab !== undefined && controlledSetActiveTab !== undefined;
  const activeTab = isControlled
    ? (normalizeTabId(controlledActiveTab) ?? "overview")
    : internalActiveTab;
  const setActiveTab = isControlled
    ? controlledSetActiveTab
    : setInternalActiveTab;
  const setActiveTabWithLocation = useCallback(
    (tab: string) => {
      const normalizedTab = normalizeTabId(tab) || "overview";
      setActiveTab(normalizedTab);

      const params = new URLSearchParams(location.search);
      if (normalizeTabId(params.get("tab") || undefined) === normalizedTab) {
        return;
      }

      params.set("tab", normalizedTab);
      navigate(
        {
          pathname: location.pathname,
          search: `?${params.toString()}`,
        },
        { replace: true, state: location.state }
      );
    },
    [location.pathname, location.search, location.state, navigate, setActiveTab]
  );
  const [search, setSearch] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const isGroupChat =
    (chat?.participants && chat?.participants?.length > 2) ||
    chat?.chat_type === "group";

  const availableTabs = useMemo(() => {
    if (isClient) {
      return CLIENT_TABS.filter((tab) => {
        if (tab.requiresFiles && hideFiles) return false;
        return true;
      });
    }

    return ALL_TABS.filter((tab) => {
      if (isGroupChat && tab.id === "overview") return false;
      if (tab.requiresFiles && hideFiles) return false;
      if (tab.requiresNotes && hideNotes) return false;
      if (tab.requiresRecommended && !isClient) return false;
      return true;
    });
  }, [isClient, hideFiles, hideNotes, isGroupChat]);

  const visibleTabs = isClient
    ? availableTabs
    : availableTabs.filter((t) => !MORE_MENU_TAB_IDS.has(t.id));

  const overflowTabs = isClient
    ? []
    : availableTabs.filter((t) => MORE_MENU_TAB_IDS.has(t.id));

  const defaultTab =
    queryTab ||
    (isClient || isGroupChat
      ? "messages"
      : (normalizeTabId(location.state?.id) ?? "overview"));

  useEffect(() => {
    if (!queryTab) {
      return;
    }

    const isTabAvailable = availableTabs.some((tab) => tab.id === queryTab);
    if (!isTabAvailable || activeTab === queryTab) {
      return;
    }

    setActiveTab(queryTab);
  }, [activeTab, availableTabs, queryTab, setActiveTab]);

  useEffect(() => {
    setChat(null);
    setSelectedClient(null);
    setSearch("");
  }, [chatId]);

  useEffect(() => {
    if (isGroupChat && activeTab === "overview") {
      setActiveTabWithLocation("messages");
    }
  }, [isGroupChat, activeTab, setActiveTabWithLocation]);

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

  const receiver = useMemo(
    () => chat?.participants?.find((p) => p.user.email !== profile?.email),
    [chat, profile?.email]
  );

  const receiverUserId = receiver?.user?.id;

  const { data: clientCoaches } = useGetClientCoachesQuery(receiverUserId!, {
    skip: !receiverUserId,
  });

  const healthHistoryClientId = receiver?.user?.id;

  const { currentData: healthHistoryData } =
    useGetCoachClientHealthHistoryQuery(healthHistoryClientId!, {
      skip: !healthHistoryClientId,
    });

  const hasHealthHistory = Boolean(
    healthHistoryData && Object.keys(healthHistoryData).length > 0
  );

  const handleOpenHealthProfile = (clientId: string | undefined) => {
    if (!clientId) {
      return;
    }

    if (!hasHealthHistory) {
      toast({
        title: "No health history found for this client",
        variant: "destructive",
      });
      return;
    }

    setHealthProfileClientId(clientId);
  };

  const initials = (() => {
    if (chat?.name) {
      return chat.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("");
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

  const selectedClientStatus = useMemo(() => {
    const currentUserId =
      receiver?.user?.id || receiver?.user?.user_id || chatId;

    if (!currentUserId || !clients?.data?.clients) {
      return null;
    }

    const client = clients.data.clients.find(
      (item) => item.client_id === currentUserId
    );

    return client?.status ?? null;
  }, [receiver, chatId, clients]);

  if (isLoading) return <MessageTabsLoadingSkeleton />;
  if (!chat) return null;

  const displayName =
    chat.name ||
    (receiver?.user.first_name &&
      receiver?.user.last_name &&
      `${receiver?.user.first_name} ${receiver?.user.last_name}`) ||
    receiver?.user.name ||
    "Unknown name";

  const displayEmail = chat.description || receiver?.user.email || "";

  const coachDisplayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.name ||
    profile?.email ||
    "-";

  const allMedicalConditionGroups = [
    GASTROINTESTINAL,
    HORMONES_METABOLIC,
    CARDIOVASCULAR,
    CANCER,
    GENITAL_URINARY,
    MUSCULOSKELETAL,
    IMMUNE_INFLAMMATORY,
    RESPIRATORY,
    SKIN,
    NEUROLOGIC_MOOD,
    MISCELLANEOUS,
  ];

  const medicalDiagnoses = allMedicalConditionGroups.flatMap((group) =>
    getYesConditionLabels(healthHistoryData as Record<string, any>, group)
  );

  const structuralConstraints = getYesConditionLabels(
    healthHistoryData as Record<string, any>,
    MUSCULOSKELETAL
  );

  return (
    <main
      className={`flex flex-col w-full ${isClient ? "min-h-screen" : "lg:pl-0 lg:w-[calc(100%-116px)] h-[calc(100vh-65px)]"} h-full px-4 py-6 md:p-6 lg:p-[24px]`}
    >
      {isClient && (
        <div className="flex flex-col border-x-0 my-[24px]">
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
                  <AvatarFallback className="bg-[#1B63DB] opacity-[70%] text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[16px] text-[#1D1D1F]">
                  {displayName}
                </span>
                <span className="text-muted-foreground text-[12px]">
                  {displayEmail}
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
      )}

      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={setActiveTabWithLocation}
        className="flex min-h-0 flex-1 flex-col"
      >
        {isClient ? (
          <TabsList className="border-b w-full justify-start items-center overflow-x-auto overflow-y-hidden">
            {visibleTabs.map((tab) => (
              <div key={tab.id} className="relative group">
                <TabsTrigger value={tab.id} className="min-w-[120px]">
                  {tab.id === "messages" && isClient ? "Chat" : tab.label}
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
        ) : (
          <TabsList className="mt-0 p-[8px] border-[ECEFF4] rounded-[16px] h-fit bg-white w-full justify-start items-center overflow-x-auto overflow-y-hidden border-none flex items-center justify-start gap-0">
            {visibleTabs.map((tab) => (
              <div
                key={tab.id}
                className="relative min-w-[113px] w-fit flex items-center justify-center"
              >
                <TabsTrigger
                  value={tab.id}
                  className="w-full rounded-xl transition-colors duration-200 data-[state=active]:bg-gray-100 data-[state=active]:text-blue-600"
                >
                  {tab.label}
                </TabsTrigger>
              </div>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="ml-auto">
                <Button variant="unstyled">
                  <MaterialIcon iconName="more_vert" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="bg-white rounded-[16px] p-[16px] shadow-lg min-w-[215px] mt-[8px]"
              >
                {overflowTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    className="flex items-center justify-between gap-2 p-[8px] pl-[16px]"
                  >
                    <TabsTrigger
                      value={tab.id}
                      className="flex-1 justify-start rounded-none p-0 hover:bg-transparent data-[state=active]:bg-transparent"
                    >
                      {tab.label}
                    </TabsTrigger>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsList>
        )}

        {!isClient && (
          <div className="flex flex-col border-x-0 my-[24px]">
            <div className="flex items-center justify-between">
              {activeTab !== "overview" && (
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
                      <AvatarFallback className="bg-[#1B63DB] opacity-[70%] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[16px] text-[#1D1D1F]">
                      {displayName}
                    </span>
                    <span className="text-muted-foreground text-[12px]">
                      {displayEmail}
                    </span>
                  </div>
                  {chat.participants.length <= 2 && healthHistoryData?.age && (
                    <div className="flex flex-col ml-[25px]">
                      <span className="font-semibold text-[16px] text-[#1D1D1F]">
                        Age
                      </span>
                      <span className="text-muted-foreground text-[12px]">
                        {healthHistoryData?.age ?? "-"}
                      </span>
                    </div>
                  )}
                </div>
              )}
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
        )}

        <TabsContent
          value="overview"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-2 h-[calc(100vh-220px)]">
            <OverviewTab
              clientName={displayName}
              clientEmail={displayEmail}
              coachName={coachDisplayName}
              clientStatus={selectedClientStatus}
              onHealthProfileClick={() =>
                handleOpenHealthProfile(receiver?.user.id)
              }
              age={healthHistoryData?.age ?? null}
              cycles={
                healthHistoryData?.menses_pms_pain ??
                healthHistoryData?.cycle_second_half_symptoms ??
                null
              }
              chiefConcern={healthHistoryData?.main_health_concerns ?? null}
              medicalDiagnoses={medicalDiagnoses}
              structuralConstraints={structuralConstraints}
              caseSummary={
                "High-complexity, medically fragile multisystem case with low physiological reserve."
              }
            />

            <div className="relative mt-auto">
              <div className="relative flex h-[120px] border border-[#1C63DB] rounded-lg px-[16px] bg-white">
                <textarea
                  readOnly
                  placeholder="Ask me anything"
                  value=""
                  className="w-full h-[115px] py-[10px] bg-transparent placeholder:text-[#B3BCC8] text-[14px] font-medium resize-none focus:outline-none focus:ring-0 focus:border-transparent"
                  style={{
                    WebkitTextSizeAdjust: "100%",
                    textSizeAdjust: "100%",
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute left-[12px] bottom-[8px] text-[#1D1D1F] rounded-full w-[40px] h-[40px] hover:bg-secondary/80"
                >
                  <MaterialIcon iconName="attach_file" size={20} fill={1} />
                </Button>
                <Button
                  type="button"
                  className="h-[44px] w-[44px] p-0 rounded-full text-[#1C63DB] mr-2"
                  title="Read text"
                >
                  <MaterialIcon iconName="mic" size={24} />
                </Button>
                <Button
                  type="button"
                  className="h-[44px] w-[44px] p-0 rounded-full text-[#1C63DB] disabled:text-[#5F5F65] disabled:opacity-1"
                  title="Send"
                  disabled
                >
                  <MaterialIcon iconName="send" fill={1} size={24} />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="messages"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <MessagesTab
            refetch={refetch}
            chat={chat}
            search={search}
            sendMessage={sendMessage}
            loadMessages={loadMessages}
          />
        </TabsContent>
        <TabsContent
          value="files"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <FilesTab chatId={chatId} />
        </TabsContent>
        <TabsContent
          value="recommended"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <RecommendedTab
            isClient={isClient}
            clientId={receiver?.user.id || location.pathname.split("/").pop()}
          />
        </TabsContent>
        {!isClient && (
          <TabsContent
            value="shared-content"
            className="mt-0 min-h-0 flex-1 overflow-y-auto"
          >
            <SharedContentTab
              isClient={false}
              clientId={receiver?.user.id || location.pathname.split("/").pop()}
            />
          </TabsContent>
        )}
        <TabsContent
          value="notes"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <NotesTab chat={chat} search={search} />
        </TabsContent>
        <TabsContent
          value="medications"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <MedicationsTab chat={chat} search={search} />
        </TabsContent>
        <TabsContent
          value="supplements"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
          <SupplementsTab chat={chat} search={search} />
        </TabsContent>
        <TabsContent
          value="collaborations"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
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
              No collaborations yet.
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="journals"
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
        >
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
          onEdit={() => {}}
          onDelete={() => {}}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {healthProfileClientId && (
        <ClientComprehensiveSummary
          clientId={healthProfileClientId}
          asDialog
          open={Boolean(healthProfileClientId)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setHealthProfileClientId(null);
            }
          }}
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
