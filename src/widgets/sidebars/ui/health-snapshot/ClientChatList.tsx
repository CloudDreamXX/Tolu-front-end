import { useFetchAllChatsQuery } from "entities/chat/api";
import { chatsSelectors } from "entities/chat/chatsSlice";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";

interface ClientChatListProps {
  onPopupClose?: () => void;
  onCloseSideBar?: () => void;
}

export const ClientChatList: React.FC<ClientChatListProps> = ({
  onPopupClose,
  onCloseSideBar,
}) => {
  const nav = useNavigate();
  const token = useSelector((state: RootState) => state.user?.token);
  const { isLoading } = useFetchAllChatsQuery(undefined, { skip: !token });
  const chatList = useSelector(chatsSelectors.selectAll);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full ">
        <MaterialIcon
          iconName="progress_activity"
          className="text-blue-600 animate-spin"
        />
      </div>
    );
  }

  return (
    <>
      {chatList.map((chat) => {
        const reciver = chat.participants[0];

        return (
          <button
            key={chat.id}
            className="flex pl-8 mb-4"
            onClick={() => {
              onPopupClose?.();
              onCloseSideBar?.();
              nav(`/messages/${chat.id}`);
            }}
          >
            <div className="relative">
              <Avatar className="w-10 h-10 ">
                <AvatarImage src={chat.avatar_url} />
                <AvatarFallback className="bg-slate-300">
                  {reciver.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
              <span
                className={cn(
                  "absolute -top-2 right-0 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full",
                  { hidden: !chat.unreadCount }
                )}
              >
                {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
              </span>
            </div>
            <div className="relative ml-3">
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
