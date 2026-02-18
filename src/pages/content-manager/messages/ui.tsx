import {
  ChatItemModel,
  ChatMessageModel,
  ChatSocketService,
  DetailsChatItemModel,
  FetchChatMessagesResponse,
} from "entities/chat";
import {
  useCreateGroupChatMutation,
  useFetchAllChatsQuery,
  useSendMessageMutation,
  useUpdateGroupChatMutation,
  useLazyFetchChatMessagesQuery,
} from "entities/chat/api";
import { applyIncomingMessage, chatsSelectors } from "entities/chat/chatsSlice";
import { Client, useGetManagedClientsQuery, useInviteClientMutation } from "entities/coach";
import { RootState } from "entities/store";
import { useLazyCheckUserExistenceQuery } from "entities/user";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

import { toast, usePageWidth } from "shared/lib";
import { Button, Dialog, DialogContent, DialogTrigger, Input } from "shared/ui";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "shared/ui/dropdown-menu";
import { AddClientModal } from "widgets/AddClientModal/ui";
import { ResizableLibraryChat } from "widgets/library-small-chat/components/ResizableSmallChat";
import { MessageSidebar } from "widgets/message-sidebar";
import { MessageTabs } from "widgets/message-tabs/ui";
import { CreateGroupModal } from "widgets/message-tabs/ui/components/CreateGroupModal";

type GroupModalState =
  | { open: false }
  | {
    open: true;
    mode: "create" | "edit";
    chat?: DetailsChatItemModel | null;
    preselectedClients?: string[];
  };


export const ContentManagerMessages: React.FC = () => {
  // Upload client list logic
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      // The inviteClient mutation expects { payload: null, file }
      await inviteClient({ payload: null, file }).unwrap();
      setInviteSuccessPopup('upload');
    } catch (error) {
      console.error("Error importing clients", error);
      toast({
        variant: "destructive",
        title: "Failed to import clients",
        description: "An error occurred during import. Please try again.",
      });
    }
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { chatId: routeChatId } = useParams();
  const { isMobileOrTablet } = usePageWidth();
  const chats = useSelector(chatsSelectors.selectAll);

  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [groupModalOpen, setGroupModalOpen] = useState<GroupModalState>({ open: false });
  const [searchChats, setSearchChats] = useState("");
  const [addClientModal, setAddClientModal] = useState(false);
  const [importClientsPopup, setImportClientsPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const [newClient, setNewClient] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    is_primary_coach: false,
    focus_areas: [],
    permission_type: "",
  });
  // inviteSuccessPopup: false | 'add' | 'upload'
  const [inviteSuccessPopup, setInviteSuccessPopup] = useState<false | 'add' | 'upload'>(false);
  const [pendingInvitePayload, setPendingInvitePayload] = useState(null as typeof newClient | null);
  const [confirmExistingUser, setConfirmExistingUser] = useState(false);
  const updateClient = (field: string, value: any) => setNewClient((prev) => ({ ...prev, [field]: value }));
  const handleAddClientCancel = () => {
    setAddClientModal(false);
    setNewClient({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      is_primary_coach: false,
      focus_areas: [],
      permission_type: "",
    });
  };
  const [inviteClient] = useInviteClientMutation();
  const [checkUserExistence] = useLazyCheckUserExistenceQuery();
  const handleAddClientSave = async () => {
    try {
      const email = newClient.email?.trim();
      if (!email) return;
      const { success: exists } = await checkUserExistence(email).unwrap();
      if (exists) {
        setPendingInvitePayload(newClient);
        setConfirmExistingUser(true);
        return;
      } else {
        await inviteClient({ payload: newClient });
        setInviteSuccessPopup('add');
        setAddClientModal(false);
        setNewClient({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          is_primary_coach: false,
          focus_areas: [],
          permission_type: "",
        });
      }
    } catch (error) {
      console.error("Invite error:", error);
      toast({
        variant: "destructive",
        title: "Failed to invite client",
        description: "Please try again.",
      });
    }
  };
  const handleConfirmInviteExisting = async () => {
    if (!pendingInvitePayload) return;
    try {
      await inviteClient({ payload: pendingInvitePayload });
      setInviteSuccessPopup("add");
      setConfirmExistingUser(false);
      setPendingInvitePayload(null);
      setAddClientModal(false);
      setNewClient({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        is_primary_coach: false,
        focus_areas: [],
        permission_type: "",
      });
    } catch (error) {
      console.error("Failed to invite existing user", error);
      toast({
        variant: "destructive",
        title: "Failed to invite client",
        description: "Failed to invite client. Please try again.",
      });
    }
  };

  const token = useSelector((state: RootState) => state.user?.token);

  const { isLoading } = useFetchAllChatsQuery(undefined, { skip: !token });
  const [createGroupChatMutation] = useCreateGroupChatMutation();
  const [updateGroupChatMutation] = useUpdateGroupChatMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [fetchChatMessagesTrigger] = useLazyFetchChatMessagesQuery();
  const { data } = useGetManagedClientsQuery();
  const [widthPercent, setWidthPercent] = useState(30);

  const safeWidthPercent = Math.min(50, Math.max(10, widthPercent));

  const handlerRef = useRef<(m: ChatMessageModel) => void>(() => { });

  useEffect(() => {
    if (data && data.data?.clients) {
      const activeClients = data.data.clients.filter(
        (client) => client.status === "active"
      );
      setClientsData(activeClients);
    }
  }, [data, setClientsData]);

  const routeMatch = useMemo(() => {
    if (!routeChatId || !chats.length) {
      // If we have a routeChatId but no chats yet, still allow creation of new chat
      if (routeChatId) return "pending";
      return null;
    }
    return (
      chats.find((c) => c.participants?.[0]?.id === routeChatId) ||
      chats.find((c) => c.id === routeChatId) ||
      null
    );
  }, [routeChatId, chats]);

  useEffect(() => {
    if (!routeChatId) {
      setSelectedChat(null);
      return;
    }

    if (routeMatch && routeMatch !== "pending") {
      setSelectedChat(routeMatch);
      return;
    }

    const client = clientsData.find((c) => c.client_id === routeChatId);
    if (!client) return;

    setSelectedChat({
      id: routeChatId,
      type: "new_chat",
      name: client.name || `${client.first_name} ${client.last_name}`,
      avatar_url: "",
      participants: [
        {
          id: client.client_id,
          email: "",
          name: client.name || `${client.first_name} ${client.last_name}`,
          first_name: client.first_name,
          last_name: client.last_name,
        },
      ],
      lastMessage: null,
      unreadCount: 0,
      lastMessageAt: new Date().toISOString(),
    });
  }, [routeChatId, routeMatch, clientsData]);

  useEffect(() => {
    handlerRef.current = (msg: ChatMessageModel) => {
      dispatch(applyIncomingMessage({ msg, activeChatId: selectedChat?.id }));
    };
  }, [dispatch, selectedChat?.id]);

  useEffect(() => {
    const stableListener = (m: ChatMessageModel) => handlerRef.current(m);

    ChatSocketService.on("new_message", stableListener);
    return () => ChatSocketService.off("new_message", stableListener);
  }, []);

  const onSubmit = async ({
    mode,
    name,
    image,
    description,
    add_participant,
    remove_participant,
  }: {
    mode: "create" | "edit";
    name: string;
    image: File | null;
    description?: string;
    add_participant?: string[];
    remove_participant?: string[];
  }) => {
    try {
      if (mode === "create") {
        const resp = await createGroupChatMutation({
          request: {
            name,
            description,
            participant_ids:
              (add_participant?.filter((n) => typeof n === "string" && n.trim() !== "") || [])
                .map((n) => {
                  const found = clientsData.find(
                    (c) => `${c.first_name} ${c.last_name}`.trim() === n.trim()
                  );
                  return found?.client_id || "";
                }),
          },
          avatar_image: image ?? undefined,
        }).unwrap();
        navigate(`/clients/${resp.data.chat_id}`);
      } else {
        await updateGroupChatMutation({
          chatId:
            groupModalOpen.open &&
              groupModalOpen.mode === "edit" &&
              groupModalOpen.chat
              ? groupModalOpen.chat.chat_id
              : "",
          payload: {
            request: {
              name,
              description,
              add_participant_ids: add_participant,
              remove_participant_ids: remove_participant,
            },
            avatar_image: image ?? undefined,
          },
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error with group chat",
        description:
          JSON.stringify(error) ||
          "An error occurred while creating(editing) the group chat.",
      });
    } finally {
      setGroupModalOpen({ open: false });
    }
  };

  const openCreateGroup = (preselectedClients?: string[]) =>
    setGroupModalOpen({ open: true, mode: "create", preselectedClients });

  const openEditGroup = (chat: DetailsChatItemModel) =>
    setGroupModalOpen({ open: true, mode: "edit", chat });

  const closeGroup = () => setGroupModalOpen({ open: false });

  const chatItemClick = (chatItem: ChatItemModel) => {
    if (selectedChat === chatItem) {
      navigate(`/clients`);
      setSelectedChat(null);
    } else {
      navigate(`/clients/${chatItem.id}`);
    }
  };

  const sendMessage = async (
    content: string
  ): Promise<ChatMessageModel | undefined> => {
    if (!selectedChat) return;

    try {
      const resp = await sendMessageMutation({
        content,
        message_type: "text",
        reply_to_message_id: undefined,
        chat_id: selectedChat.type === "new_chat" ? undefined : selectedChat.id,
        target_user_id:
          selectedChat.type === "new_chat" ? selectedChat.id : undefined,
      }).unwrap();

      return resp.data as ChatMessageModel;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again.",
      });
      return undefined;
    }
  };

  const loadMessages = async (
    page: number
  ): Promise<FetchChatMessagesResponse | undefined> => {
    if (!selectedChat) return;

    if (selectedChat.type === "new_chat") {
      return undefined;
    }

    try {
      const data = await fetchChatMessagesTrigger({
        chatId: selectedChat.id,
        page,
      }).unwrap();
      return data.data;
    } catch (err) {
      console.error(err);
      if ((err as any).data.detail === "Access denied") {
        return undefined;
      }
      toast({
        variant: "destructive",
        title: "Failed to load messages",
      });
      return undefined;
    }
  };

  const filteredChats = chats.filter(item => {
    if (item.name && typeof item.name === "string") {
      return item.name.toLowerCase().includes(searchChats.toLowerCase());
    }
    return item.participants.some(p =>
      (p.first_name && p.first_name.toLowerCase().includes(searchChats.toLowerCase())) ||
      (p.last_name && p.last_name.toLowerCase().includes(searchChats.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(searchChats.toLowerCase()))
    );
  });

  const content = (() => {
    if (isMobileOrTablet) {
      if (selectedChat) {
        return (
          <MessageTabs
            chatId={selectedChat.id}
            goBackMobile={() => setSelectedChat(null)}
            clientsData={clientsData}
            onEditGroup={openEditGroup}
            onCreateGroup={openCreateGroup}
            sendMessage={sendMessage}
            loadMessages={loadMessages}
          />
        );
      }
      return (
        <MessageSidebar
          chats={filteredChats}
          isLoadingChats={isLoading}
          onChatClick={chatItemClick}
          selectedChat={selectedChat}
          onCreateGroup={openCreateGroup}
        />
      );
    }

    return (
      <>
        {isLoading && (
          <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-1/2 -translate-x-1/2 xl:-translate-x-1/4">
            <span className="inline-flex items-center justify-center w-5 h-5">
              <MaterialIcon
                iconName="progress_activity"
                className="text-blue-600 animate-spin"
              />
            </span>
            Please wait, we are loading the information...
          </div>
        )}
        <div className="flex flex-col" style={{ width: isMobileOrTablet ? "100%" : `${100 - safeWidthPercent}%` }}>
          <div className="flex justify-between items-center">
            <div className="w-[316px] ml-[24px] mt-[24px]">
              <Input
                type="text"
                icon={<MaterialIcon iconName="search" className="text-[5F5F65]" />}
                placeholder="Search"
                value={searchChats}
                onChange={e => setSearchChats(e.target.value)}
                className="w-full rounded-[1000px] border border-[#D6D7D9] px-[12px] py-[10px] pl-[40px] text-[14px]"
              />
            </div>
            <div className="flex items-center gap-[24px] mr-[24px] mt-[24px]">
              <Button variant={"ghost"}>
                <MaterialIcon iconName="more_vert" className="rotate-[90deg]" />
              </Button>
              <Button variant="brightblue" className="rounded-full w-[32px] h-[32px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="brightblue" className="rounded-full w-[32px] h-[32px]">
                      <MaterialIcon iconName="add" className="text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setAddClientModal(true)}>
                      Add Client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setImportClientsPopup(true)}>
                      Upload Client CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGroupModalOpen({ open: true, mode: "create" })}>
                      Create New Chat
                    </DropdownMenuItem>
                    {selectedChat && <><DropdownMenuItem onClick={() => setActiveTab("notes")}>Add Note</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab("supplements")}>Add Supplement</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab("medications")}>Add Medication</DropdownMenuItem></>}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* AddClientModal */}
                {addClientModal && (
                  <AddClientModal
                    client={newClient}
                    updateClient={updateClient}
                    onCancel={handleAddClientCancel}
                    onSave={handleAddClientSave}
                  />
                )}
              </Button>
            </div>
          </div>
          <div className="flex">
            <div>
              <MessageSidebar
                chats={filteredChats}
                isLoadingChats={isLoading}
                onChatClick={chatItemClick}
                selectedChat={selectedChat}
                onCreateGroup={openCreateGroup}
              />
            </div>

            <MessageTabs
              chatId={selectedChat?.id || undefined}
              goBackMobile={() => setSelectedChat(null)}
              clientsData={clientsData}
              onEditGroup={openEditGroup}
              onCreateGroup={openCreateGroup}
              sendMessage={sendMessage}
              loadMessages={loadMessages}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
        {!isMobileOrTablet && (
          <ResizableLibraryChat
            widthPercent={widthPercent > 50 ? 50 : widthPercent < 10 ? 10 : widthPercent || 30}
            setWidthPercent={setWidthPercent}
            isCoach
          />
        )}
      </>
    );
  })();

  return (
    <div className="relative flex h-full border">
      {content}

      {groupModalOpen.open && (
        <CreateGroupModal
          key={`${groupModalOpen.open ? groupModalOpen.mode : "create"}:${groupModalOpen.open && groupModalOpen.mode === "edit"
            ? (groupModalOpen.chat?.chat_id ?? "new")
            : "new"
            }`}
          open={groupModalOpen.open}
          mode={groupModalOpen.open ? groupModalOpen.mode : "create"}
          chat={
            groupModalOpen.open && groupModalOpen.mode === "edit"
              ? (groupModalOpen.chat ?? null)
              : null
          }
          initialSelectedClients={
            groupModalOpen.open && groupModalOpen.mode === "create"
              ? (groupModalOpen.preselectedClients ?? [])
              : []
          }
          onSubmit={onSubmit}
          onClose={closeGroup}
          clientsData={clientsData}
        />
      )}

      {/* Invite Success Popup */}
      {inviteSuccessPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <span className="text-green-600 text-4xl">
              <MaterialIcon iconName="check_circle" />
            </span>
            <div className="text-lg font-semibold">
              {inviteSuccessPopup === 'add' ? 'Client invited successfully!' : 'Clients uploaded successfully!'}
            </div>
            <Button variant="brightblue" onClick={() => {
              setInviteSuccessPopup(false);
              if (inviteSuccessPopup === 'upload') {
                setImportClientsPopup(false);
                setUploadedFileName(null);
                setUploadedFileSize(null);
              }
            }}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Existing User Dialog */}
      {confirmExistingUser && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <div className="text-lg font-semibold">This email already exists. Invite anyway?</div>
            <div className="flex gap-4">
              <Button variant="unstyled" onClick={() => setConfirmExistingUser(false)}>
                Cancel
              </Button>
              <Button variant="brightblue" onClick={handleConfirmInviteExisting}>
                Invite
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Upload Client List Dialog (moved outside dropdown) */}
      <Dialog open={importClientsPopup} onOpenChange={setImportClientsPopup}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-3xl gap-6 left-[50%] bottom-auto top-[50%] rounded-[18px] z-[999] grid translate-x-[-50%] translate-y-[-50%] mx-[16px]">
          {uploadedFileName ? (
            <div className="w-full max-w-[330px]">
              <p className="text-left text-black text-base font-medium mb-[8px]">Import CSV/XLSX</p>
              <div className="w-full relative border border-[#1C63DB] rounded-[8px] px-[16px] py-[12px] flex items-center gap-3">
                <MaterialIcon iconName="docs" fill={1} />
                <div className="flex flex-col leading-[1.2]">
                  <p className="text-[14px] text-black font-semibold">{uploadedFileName}</p>
                  <p className="text-[12px] text-[#5F5F65]">{uploadedFileSize}</p>
                </div>
                <Button variant={"unstyled"} size={"unstyled"} onClick={() => { setUploadedFileName(null); setUploadedFileSize(null); }} className="absolute top-[6px] right-[6px]">
                  <MaterialIcon iconName="close" size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-left text-black text-base font-medium mb-[8px]">Import CSV/XLSX</p>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                tabIndex={0}
                aria-label="Upload client list"
                className={`w-full border ${dragOver ? "border-[#0057C2]" : "border-dashed border-[#1C63DB]"} rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer`}
                onClick={handleUploadClick}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { handleUploadClick(); } }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <MaterialIcon iconName="cloud_upload" fill={1} className="text-[#1C63DB] p-2 border rounded-xl" />
                <div className="text-[#1C63DB] text-[14px] font-semibold">Click or drag to upload</div>
                <p className="text-[#5F5F65] text-[14px] mt-[4px]">CSV/XLSX</p>
              </Button>
            </div>
          )}
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={handleFileChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
