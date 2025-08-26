import { chatsSelectors } from "entities/chat/chatsSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import { MessageTabs } from "widgets/message-tabs/ui";

export const ClientMessages = () => {
  const { chatId: routeChatId } = useParams();
  const nav = useNavigate();
  const chats = useSelector(chatsSelectors.selectAll);
  const firstChatId = chats[0]?.id;

  useEffect(() => {
    if (!routeChatId && firstChatId) {
      nav(`/messages/${firstChatId}`, { replace: true });
    }
  }, [routeChatId, firstChatId, nav]);

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

  return (
    <MessageTabs
      chatId={routeChatId}
      goBackMobile={() => {
        nav("library");
      }}
    />
  );
};
