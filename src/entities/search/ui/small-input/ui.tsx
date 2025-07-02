import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sparkle from "shared/assets/icons/sparkle-2";
import { Button } from "shared/ui";

export const SearchAiSmallInput = () => {
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
