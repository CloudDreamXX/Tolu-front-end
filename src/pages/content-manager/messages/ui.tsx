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
import { Client, useGetManagedClientsQuery } from "entities/coach";
import { RootState } from "entities/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

import { toast, usePageWidth } from "shared/lib";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { chatId: routeChatId } = useParams();
  const { isMobileOrTablet } = usePageWidth();
  const chats = useSelector(chatsSelectors.selectAll);

  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [groupModalOpen, setGroupModalOpen] = useState<GroupModalState>({
    open: false,
  });

  const token = useSelector((state: RootState) => state.user?.token);

  const { isLoading } = useFetchAllChatsQuery(undefined, { skip: !token });
  const [createGroupChatMutation] = useCreateGroupChatMutation();
  const [updateGroupChatMutation] = useUpdateGroupChatMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [fetchChatMessagesTrigger] = useLazyFetchChatMessagesQuery();
  const { data } = useGetManagedClientsQuery();

  const handlerRef = useRef<(m: ChatMessageModel) => void>(() => { });

  useEffect(() => {
    if (data && data.clients) {
      const activeClients = data.clients.filter(
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
        navigate(`/content-manager/messages/${resp.chat_id}`);
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
      navigate(`/content-manager/messages`);
      setSelectedChat(null);
    } else {
      navigate(`/content-manager/messages/${chatItem.id}`);
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

      return resp as ChatMessageModel;
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
      return data;
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
          chats={chats}
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

        <MessageSidebar
          chats={chats}
          isLoadingChats={isLoading}
          onChatClick={chatItemClick}
          selectedChat={selectedChat}
          onCreateGroup={openCreateGroup}
        />

        <MessageTabs
          chatId={selectedChat?.id || undefined}
          goBackMobile={() => setSelectedChat(null)}
          clientsData={clientsData}
          onEditGroup={openEditGroup}
          onCreateGroup={openCreateGroup}
          sendMessage={sendMessage}
          loadMessages={loadMessages}
        />
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
    </div>
  );
};
