import { ChatItemModel, DetailsChatItemModel } from "entities/chat";
import {
  useCreateGroupChatMutation,
  useFetchAllChatsQuery,
  useUpdateGroupChatMutation,
} from "entities/chat/chatApi";
import { chatsSelectors } from "entities/chat/chatsSlice";
import { Client, CoachService } from "entities/coach";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
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
  const { chatId: routeChatId } = useParams();
  const { isMobileOrTablet } = usePageWidth();

  const chats = useSelector(chatsSelectors.selectAll);

  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [groupModalOpen, setGroupModalOpen] = useState<GroupModalState>({
    open: false,
  });

  const { isLoading } = useFetchAllChatsQuery();
  const [createGroupChatMutation] = useCreateGroupChatMutation();
  const [updateGroupChatMutation] = useUpdateGroupChatMutation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const clients = await CoachService.getManagedClients();
        const filtered = clients.clients.filter((c) => c.status === "active");
        if (mounted) setClientsData(filtered);
      } catch (e) {
        console.error("Failed to fetch clients:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const routeMatch = useMemo(() => {
    if (!routeChatId || !chats.length) return null;
    return (
      chats.find((c) => c.participants?.[0]?.id === routeChatId) ||
      chats.find((c) => c.id === routeChatId) ||
      null
    );
  }, [routeChatId, chats]);

  useEffect(() => {
    if (routeMatch) {
      setSelectedChat(routeMatch);
    }
  }, [routeMatch, setSelectedChat]);

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
              add_participant?.map(
                (n) => clientsData.find((c) => c.name === n)?.client_id || ""
              ) || [],
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

  if (selectedChat && isMobileOrTablet) {
    return (
      <MessageTabs
        chatId={selectedChat?.id}
        goBackMobile={() => setSelectedChat(null)}
        onEditGroup={openEditGroup}
        onCreateGroup={openCreateGroup}
      />
    );
  }

  if (!selectedChat && isMobileOrTablet) {
    return (
      <MessageSidebar
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        onCreateGroup={openCreateGroup}
      />
    );
  }

  return (
    <div className="flex h-full bg-slate-[#DBDEE1] border">
      {isLoading && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <MaterialIcon
            iconName="progress_activity"
            className="text-blue-600 animate-spin"
          />
          Please wait, we are loading the information...
        </div>
      )}
      <MessageSidebar
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        onCreateGroup={openCreateGroup}
      />

      <MessageTabs
        chatId={selectedChat?.id || routeChatId || undefined}
        goBackMobile={() => setSelectedChat(null)}
        clientsData={clientsData}
        onEditGroup={openEditGroup}
        onCreateGroup={openCreateGroup}
      />

      <CreateGroupModal
        key={`${groupModalOpen.open ? groupModalOpen.mode : "create"}:${
          groupModalOpen.open && groupModalOpen.mode === "edit"
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
    </div>
  );
};
