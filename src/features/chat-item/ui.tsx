import { ChatItemModel } from "entities/chat";
import { cn } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";
import { toUserTZ } from "../../widgets/message-tabs/helpers";

export const timeAgo = (date: string | Date | null) => {
  if (!date) return "—";

  const t =
    typeof date === "string" ? new Date(date).getTime() : date.getTime();
  if (Number.isNaN(t)) return "—";

  const diffMs = Math.max(0, Date.now() - t);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return new Date(t).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

interface ChatItemProps {
  item: ChatItemModel;
  onClick?: () => void;
  classname?: string;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  item,
  onClick,
  classname,
}) => {
  const initials = (() => {
    const user = item?.participants?.[0];
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
      className={cn(
        "flex flex-col w-full gap-2 lg:gap-4 p-4 md:px-6 md:py-5 lg:p-4 lg:pl-8 border-b cursor-pointer hover:bg-white border-[#DBDEE1] text-left",
        classname
      )}
      onClick={onClick}
    >
      <div className="flex justify-between ">
        <div className="flex items-center ">
          <div className="relative mr-3">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src={item.avatar_url} />
              <AvatarFallback className="bg-slate-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
          </div>
          <div className="flex">
            <span className="font-semibold text-[18px] text-[#1D1D1F]">
              {item.participants[0]?.first_name &&
                item.participants[0]?.last_name &&
                `${item.participants[0]?.first_name} ${item.participants[0]?.last_name}` || item.name ||
                item.participants[0]?.name}
            </span>
          </div>
        </div>
        <div className="flex flex-col h-fit">
          <p className="text-muted-foreground text-[14px] font-semibold self-start text-nowrap">
            {timeAgo(toUserTZ(item.lastMessage?.created_at ?? "") ?? "")}
          </p>

          <p className="text-blue-500 text-[14px] self-end mt-2">
            {item.unreadCount ? `(${item.unreadCount})` : ""}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground text-[14px] font-normal max-w-[250px] truncate">
        {item.lastMessage?.content || "There are no messages ..."}
      </p>
    </Button>
  );
};
