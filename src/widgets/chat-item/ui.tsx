import { ChatItemModel } from "pages/content-manager";
import { cn } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";

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
  return (
    <button
      className={cn(
        "flex flex-col w-full gap-2 lg:gap-4 p-4 md:px-6 md:py-5 lg:p-4 lg:pl-8 border-b cursor-pointer hover:bg-white border-[#DBDEE1] text-left",
        classname
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center ">
          <div className="relative mr-3">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src={item.avatar} />
              <AvatarFallback className="bg-slate-300">AF</AvatarFallback>
            </Avatar>
            {item.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[18px] text-[#1D1D1F]">
              {item.name}
            </span>
            <span className="font-semibold text-muted-foreground text-[14px]">
              {item.username}
            </span>
          </div>
        </div>
        <span className="text-muted-foreground text-[14px] font-semibold self-start">
          {item.lastSeen}
        </span>
      </div>
      <p className="text-muted-foreground text-[14px] font-normal ">
        {item.lastMessage}
      </p>
    </button>
  );
};
