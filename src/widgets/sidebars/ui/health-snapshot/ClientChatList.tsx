import { ChatService, ChatSocketService } from "entities/chat";
import { setChatList } from "entities/chat/lib";
import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";
import { getAvatarUrl } from "widgets/message-tabs/helpers";

interface ClientChatListProps {
  onPopupClose?: () => void;
}

export const ClientChatList: React.FC<ClientChatListProps> = ({
  onPopupClose,
}) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const chatList = useSelector((state: RootState) => state.chat.chats);
  const profile = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const chats = await ChatService.fetchAllChats();
        for (const chat of chats) {
          if (chat.avatar_url) {
            chat.avatar_url = await getAvatarUrl(
              chat.avatar_url.split("/").pop() || null
            );
          }
        }

        dispatch(setChatList(chats));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await UserService.getUserProfile();
        ChatSocketService.connect(user.id);
      } catch (error) {
        console.error("Failed to init chat:", error);
      }
    };

    init();
    return () => {
      ChatSocketService.disconnect();
    };
  }, [profile?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full ">
        <Loader2Icon className="w-5 h-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {chatList.map((chat) => {
        const reciver = chat.participants[0];

        return (
          <button
            key={chat.chat_id}
            className="flex pl-8 mb-4"
            onClick={() => {
              onPopupClose?.();
              nav(`/messages/${chat.chat_id}`);
            }}
          >
            <div className="relative">
              <Avatar className="w-10 h-10 ">
                <AvatarImage src={chat.avatar_url} />
                <AvatarFallback className="bg-slate-300">
                  {reciver.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-left truncate hover:underline text-nowrap max-w-40">
                {chat.name ?? reciver.name}
              </h3>
              <p className="text-xs text-left text-gray-500 truncate max-w-32">
                @{chat.name || reciver.email}
              </p>
            </div>
          </button>
        );
      })}
    </>
  );
};
