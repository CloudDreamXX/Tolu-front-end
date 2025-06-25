import { ArrowRightIcon, BooksIcon } from "@phosphor-icons/react";
import { SearchHistoryItem, SearchService } from "entities/search";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/ui";

export const HistoryPopup: React.FC = () => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>();
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await SearchService.getSearchHistory();
        console.log("Search history:", res);
        setHistory(res);
      } catch (error) {
        console.error("Failed to fetch search history:", error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={historyRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#DDEBF6] rounded-full h-8 w-8 mb-9"
      >
        <BooksIcon weight="regular" className="w-4 h-4 m-auto text-blue-600" />
      </button>
      {isOpen && (
        <div className="absolute flex flex-col top-0 z-10 w-full max-w-[350px] h-full p-4 bg-white border rounded-xl shadow-lg left-14">
          <h3 className="mb-2 text-lg font-bold">Your history</h3>
          <ul className="space-y-[18px] overflow-auto h-full">
            {history && history.length > 0 ? (
              history.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-row p-4 border rounded-lg"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold leading-none text-gray-800">
                      {item.chatTitle || "Untitled Chat"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <Button
                    className="ml-auto rounded-full bg-[#DDEBF6] hover:bg-[#CFE2F3] p-2"
                    onClick={() => {
                      nav(`/library/${item.chatId}`, {
                        state: {
                          isExistingChat: true,
                        },
                      });
                    }}
                  >
                    <ArrowRightIcon className="text-[#1C63DB]" size={24} />
                  </Button>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No search history found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
