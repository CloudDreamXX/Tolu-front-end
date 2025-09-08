import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button } from "shared/ui";

export const SearchAiSmallInput = ({
  sidebarOpen,
}: {
  sidebarOpen: boolean;
}) => {
  const nav = useNavigate();
  const { chatId } = useParams();
  const [search, setSearch] = useState<string>("");

  const handleSearch = () => {
    nav(`/library`, {
      state: {
        message: search,
        searchType: "Search",
      },
      replace: true,
    });

    if (!search?.trim()) return;

    const isInExistingChat = chatId && !chatId.startsWith("new_chat_");

    if (isInExistingChat) {
      const newChatId = `new_chat_${Date.now()}`;
      nav(`/library/${newChatId}`, {
        state: {
          message: search,
          searchType: "Search",
          isNewSearch: true,
        },
        replace: true,
      });
    } else {
      const newChatId = `new_chat_${Date.now()}`;
      nav(`/library/${newChatId}`, {
        state: {
          message: search,
          searchType: "Search",
        },
        replace: true,
      });
    }

    setSearch("");
  };

  return (
    <div className="relative flex flex-col gap-4 w-f">
      <Button
        variant={"brightblue"}
        className={cn(
          "h-[44px] text-base font-semibold",
          sidebarOpen ? "w-full" : "w-[52px] mx-auto"
        )}
        onClick={handleSearch}
      >
        <MaterialIcon iconName="stars_2" fill={1} />
        {sidebarOpen && <span>Ask Tolu</span>}
      </Button>
    </div>
  );
};
