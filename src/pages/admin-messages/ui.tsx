import {
  useGetAllChatsQuery,
  useSendMessageMutation,
  useLazyGetMessagesByChatIdQuery,
} from "entities/admin";
import {
  ChatItemModel,
  ChatMessageModel,
  FetchChatMessagesResponse,
} from "entities/chat";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { MessageSidebar } from "widgets/message-sidebar";
import { MessageTabs } from "widgets/message-tabs/ui";
import { RootState } from "../../entities/store/lib";

export const AdminMessages: React.FC = () => {
  const navigate = useNavigate();
  const { chatId: routeChatId } = useParams();
  const [chats, setChats] = useState<ChatItemModel[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);

  const profile = useSelector((state: RootState) => state.user.user);

  const { data: chatsData, isLoading: isLoadingChats } = useGetAllChatsQuery();
  const [sendMessageApi] = useSendMessageMutation();

  useEffect(() => {
    if (chatsData) {
      const mappedChats: ChatItemModel[] = chatsData.data.map((item) => ({
        id: item.id,
        name: item.name,
        lastMessageAt: item.last_message_time,
        unreadCount: item.unread_count,
        avatar_url: "",
        createdAt: "",
        type: item.chat_type,
        participants: [],
        lastMessage: null,
      }));
      setChats(mappedChats);
    }
  }, [chatsData]);

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

  const chatItemClick = (chatItem: ChatItemModel) => {
    if (selectedChat === chatItem) {
      navigate(`/admin-messages`);
      setSelectedChat(null);
    } else {
      setSelectedChat(chatItem);
      navigate(`/admin-messages/${chatItem.id}`);
    }
  };

  const sendMessage = async (
    content: string
  ): Promise<ChatMessageModel | undefined> => {
    if (!selectedChat) return;
    const response = await sendMessageApi({
      content,
      message_type: "text",
      target_group: selectedChat?.type,
    }).unwrap();

    return {
      id: response.data.admin_chat_id,
      chat_id: selectedChat.id,
      content,
      created_at: new Date().toISOString(),
      file_url: null,
      file_name: null,
      file_size: null,
      file_type: null,
      sender: {
        name: profile?.name || "Admin",
        id: profile?.id || "admin-id",
        email: profile?.email || "admin@example.com",
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
      },
    };
  };

  const [triggerGetMessages] = useLazyGetMessagesByChatIdQuery();

  const loadMessages = async (
    page: number,
    pageSize?: number
  ): Promise<FetchChatMessagesResponse | undefined> => {
    if (!selectedChat) return;

    const data = await triggerGetMessages({
      chat_id: selectedChat.id,
      page,
      page_size: pageSize,
    }).unwrap();

    return {
      messages: data.data,
      total: data.data.length,
      page,
      limit: pageSize ?? data.data.length,
      has_next: data.data.length === (pageSize ?? data.data.length),
      has_prev: page > 1,
    };
  };

  return (
    <div className="flex h-full bg-slate-[#DBDEE1] border">
      {isLoadingChats && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
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
        isLoadingChats={isLoadingChats}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        title="Messages"
      />

      <MessageTabs
        chatId={selectedChat?.id}
        goBackMobile={() => setSelectedChat(null)}
        sendMessage={sendMessage}
        loadMessages={loadMessages}
        showAddClient={false}
        hideFiles
        hideNotes
      />
    </div>
  );
};
