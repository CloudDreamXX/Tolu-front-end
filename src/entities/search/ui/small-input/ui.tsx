import {
  clearAllChatHistory,
  clearActiveChatHistory,
  setFolderToChat,
  setFolderId,
  setFilesToChat,
  setLastChatId,
} from "entities/client/lib";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button } from "shared/ui";

export const SearchAiSmallInput = ({
  sidebarOpen,
}: {
  sidebarOpen: boolean;
}) => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleSearch = () => {
    dispatch(clearAllChatHistory());
    dispatch(clearActiveChatHistory());
    dispatch(setFolderToChat(null));
    dispatch(setFolderId(""));
    dispatch(setFilesToChat([]));
    dispatch(setLastChatId(""));
    nav("/library", { state: { isNew: true } });
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
