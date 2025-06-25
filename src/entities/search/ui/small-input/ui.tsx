import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chevron from "shared/assets/icons/chevron";
import Sparkle from "shared/assets/icons/sparkle-2";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
} from "shared/ui";

export const SearchAiSmallInput = () => {
  const nav = useNavigate();
  const { chatId } = useParams();
  const [searchType, setSearchType] = useState<string>("Search");
  const [search, setSearch] = useState<string>("");

  const handleSearch = () => {
    nav(`/library`, {
      state: {
        message: search,
        searchType: searchType || "Search",
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
          searchType: searchType || "Search",
          isNewSearch: true,
        },
        replace: true,
      });
    } else {
      const newChatId = `new_chat_${Date.now()}`;
      nav(`/library/${newChatId}`, {
        state: {
          message: search,
          searchType: searchType || "Search",
        },
        replace: true,
      });
    }

    setSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative flex flex-col w-full gap-4">
      <Button
        variant={"brightblue"}
        className="w-full h-[44px] text-base font-semibold"
        onClick={handleSearch}
      >
        <Sparkle />
        <span className="hidden 2xl:inline">Ask TOLU</span>
      </Button>
    </div>
  );
};
