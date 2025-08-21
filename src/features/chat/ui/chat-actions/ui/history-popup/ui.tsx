import { ArrowRightIcon } from "@phosphor-icons/react";
import { SearchHistoryItem, SearchService } from "entities/search";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import History from "shared/assets/icons/history";
import { Button } from "shared/ui";

type Props = {
  fromPath?: string | null;
};

const HistoryPopupComponent: React.FC<Props> = ({ fromPath }) => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>();
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await SearchService.getSearchHistory();
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

  const isContentManager = window.location.pathname.includes("content-manager");

  return (
    <div ref={historyRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center mb-[8px]"
      >
        <History />
      </button>
      {isOpen && (
        <div
          className="absolute top-0 left-0 h-full w-full bg-[#0000004D] md:block md:bg-transparent"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute flex flex-col bottom-0 top-[300px] left-0 md:top-0 md:bottom-auto z-10 w-full md:max-w-[350px] h-full p-4 bg-white border rounded-t-[18px] md:rounded-xl shadow-lg md:left-14">
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
                        nav(
                          `${isContentManager ? "/content-manager/library" : "/library"}/${item.chatId}`,
                          {
                            state: {
                              isExistingChat: true,
                              from: fromPath,
                            },
                          }
                        );
                      }}
                    >
                      <ArrowRightIcon className="text-[#1C63DB]" size={24} />
                    </Button>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  No search history found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export const HistoryPopup = memo(HistoryPopupComponent);
