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
  const [searchType, setSearchType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const handleSearch = () => {
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
      <div className="flex flex-row items-center justify-center border rounded-md">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-fit px-2 h-full flex-row gap-1.5 items-center text-sm text-black rounded-l-md border-r bg-gray-100">
            {searchType || "Type"}
            <Chevron className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[120px] ml-4 flex flex-col">
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100"
              onClick={() => setSearchType("Generate")}
            >
              Generate
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100"
              onClick={() => setSearchType("Search")}
            >
              Search
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Search..."
          className="border-none rounded-r-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Button
        variant={"brightblue"}
        className="w-full h-[44px] text-base font-semibold"
        onClick={handleSearch}
        disabled={!search?.trim()}
      >
        <Sparkle />
        Ask TOLU
      </Button>
    </div>
  );
};
