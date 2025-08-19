import { ChatItemModel, ChatService, ChatSocketService } from "entities/chat";
import { Client, CoachService } from "entities/coach";
import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import LoadingIcon from "shared/assets/icons/loading-icon";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import { toast, usePageWidth } from "shared/lib";
import { MessageSidebar } from "widgets/message-sidebar";
import { getAvatarUrl } from "widgets/message-tabs/helpers";
import { MessageTabs } from "widgets/message-tabs/ui";

export const ContentManagerMessages: React.FC = () => {
  const { chatId: routeChatId } = useParams();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatItemModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChat, setSelectedChat] = useState<ChatItemModel | null>(null);
  const profile = useSelector((state: RootState) => state.user.user);
  const [clientsData, setClientsData] = useState<Client[]>([]);

  const { isMobileOrTablet } = usePageWidth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const clients = await CoachService.getManagedClients();
        const response = await ChatService.fetchAllChats();
        const filteredClient = clients.clients.filter(
          (client) => client.status === "active"
        );

        for (const chat of response) {
          if (chat.avatar_url) {
            chat.avatar_url = await getAvatarUrl(
              chat.avatar_url.split("/").pop() || null
            );
          }
        }

        setChats(response);
        setClientsData(filteredClient);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await UserService.getUserProfile();
        ChatSocketService.connect(user.id);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize chat.",
        });
        console.error("Failed to initialize chat:", error);
      }
    };

    init();
    return () => {
      ChatSocketService.disconnect();
    };
  }, [profile?.id]);

  useEffect(() => {
    if (!loading && routeChatId && chats.length > 0) {
      const match = chats.find((c) => c.participants[0].id === routeChatId);
      const match2 = chats.find((c) => c.chat_id === routeChatId);

      if (match) {
        setSelectedChat(match);
      } else if (match2) {
        setSelectedChat(match2);
      }
    }
  }, [loading, routeChatId, chats]);

  const chatItemClick = (chatItem: ChatItemModel) => {
    if (selectedChat === chatItem) {
      navigate(`/content-manager/messages`);
      setSelectedChat(null);
    } else {
      navigate(`/content-manager/messages/${chatItem.chat_id}`);
    }
  };

  if (chats.length === 0) {
    return (
      <div>
        <div className="flex-1 flex flex-col items-center justify-center absolute top-[50%] left-[50%] translate-x-[-50%] xl:translate-x-[0] translate-y-[-50%] w-full xl:w-fit">
          <img
            src={EmptyChat}
            alt=""
            className="mb-[16px] w-[122px] md:w-[135px] xl:w-[163px]"
          />
          <div className="text-center flex flex-col items-center justify-center gap-[8px]">
            <p className="text-[18px] md:text-[28px] xl:text-[32px] font-[700] text-[#1D1D1F]">
              There are no messages ...
            </p>
            <p className="text-[16px] md:text-[20px] font-[500] text-[#5F5F65] max-w-[450px]">
              Start a conversation with a customer to provide support or answer
              a query.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedChat && isMobileOrTablet) {
    return (
      <MessageTabs
        chatId={selectedChat?.chat_id}
        goBackMobile={() => setSelectedChat(null)}
      />
    );
  }

  if (!selectedChat && isMobileOrTablet) {
    return (
      <MessageSidebar
        chats={chats}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex h-full bg-slate-[#DBDEE1] border">
      {loading && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <LoadingIcon />
          Please wait, we are loading the information...
        </div>
      )}
      <MessageSidebar
        chats={chats}
        onChatClick={chatItemClick}
        selectedChat={selectedChat}
        loading={loading}
      />
      <MessageTabs
        chatId={selectedChat?.chat_id || routeChatId || undefined}
        goBackMobile={() => setSelectedChat(null)}
        clientsData={clientsData}
      />
    </div>
  );
};
