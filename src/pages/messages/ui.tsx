import { ChatMessageModel, FetchChatMessagesResponse } from "entities/chat";
import {
  useFetchAllChatsQuery,
  useLazyFetchChatMessagesQuery,
  useSendMessageMutation,
} from "entities/chat/api";
import { chatsSelectors } from "entities/chat/chatsSlice";
import { RootState } from "entities/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import { toast } from "shared/lib";
import { MessageTabs } from "widgets/message-tabs/ui";

export const ClientMessages = () => {
  const { chatId: routeChatId } = useParams();
  const nav = useNavigate();
  const chats = useSelector(chatsSelectors.selectAll);
  const firstChatId = chats[0]?.id;

  const token = useSelector((state: RootState) => state.user?.token);

  useFetchAllChatsQuery(undefined, { skip: !token });
  const [sendMessageMutation] = useSendMessageMutation();
  const [fetchChatMessagesTrigger] = useLazyFetchChatMessagesQuery();

  useEffect(() => {
    if (firstChatId) {
      nav(`/messages/${firstChatId}`, { replace: true });
    }
  }, [firstChatId, nav]);

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center grow">
        <img src={EmptyChat} alt="No files" className="mb-6 md:mb-12" />
        <h1 className="text-lg md:text-3xl font-bold text-[#1D1D1F]">
          There are no messages yet...
        </h1>
        <p className="mt-2 text-base md:text-xl text-[#5F5F65]">
          Start a conversation with your coach if you have a question or need
          support.
        </p>
      </div>
    );
  }

  const sendMessage = async (
    content: string
  ): Promise<ChatMessageModel | undefined> => {
    if (!routeChatId) return;

    try {
      const resp = await sendMessageMutation({
        content,
        message_type: "text",
        reply_to_message_id: undefined,
        chat_id: routeChatId,
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
    if (!routeChatId) return;
    try {
      const data = await fetchChatMessagesTrigger({
        chatId: routeChatId,
        page,
      }).unwrap();
      console.log(data)
      return data.data;
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to load messages",
      });
      return undefined;
    }
  };

  return (
    <MessageTabs
      chatId={routeChatId}
      goBackMobile={() => {
        nav("library");
      }}
      sendMessage={sendMessage}
      loadMessages={loadMessages}
    />
  );
};
