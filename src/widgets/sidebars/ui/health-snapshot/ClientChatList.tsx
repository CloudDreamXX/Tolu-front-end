import { useFetchAllChatsQuery } from "entities/chat/api";
import { chatsSelectors } from "entities/chat/chatsSlice";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";

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
        const receiver = chat.participants[0];

        const initials = (() => {
          const user = receiver;
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

        return (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            key={chat.id}
            className="flex pl-8 mb-4"
            onClick={() => {
              nav(`/messages/${chat.id}`);
              onPopupClose?.();
              onCloseSideBar?.();
            }}
          >
            <div className="relative">
              <Avatar className="w-10 h-10 ">
                <AvatarImage src={chat.avatar_url} />
                <AvatarFallback className="bg-slate-300">
                  {initials}
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
                {chat.name ||
                  (receiver.first_name &&
                    receiver.last_name &&
                    `${receiver.first_name} ${receiver.last_name}`) ||
                  receiver.name ||
                  receiver.name}
              </h3>
              <p className="text-xs text-left text-gray-500 truncate max-w-32">
                @{chat.name || receiver.email}
              </p>
            </div>
          </Button>
        );
      })}
    </>
  );
};
