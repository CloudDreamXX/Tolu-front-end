import { ChatItemModel } from "entities/chat";
import { useLazyGetCoachClientHealthHistoryQuery } from "entities/health-history";
import { ChatItem, timeAgo } from "features/chat-item";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tabs,
  TabsContent,
} from "shared/ui";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { ScrollArea } from "shared/ui";
import { Dock, DockIcon } from "shared/ui/dock";
import { usePageWidth } from "shared/lib";
export interface MessageSidebarProps {
  chats: ChatItemModel[];
  isLoadingChats: boolean;
  selectedChat: ChatItemModel | null;
  onChatClick: (item: ChatItemModel) => void;
  onCreateGroup?: (clients?: string[]) => void;
  title?: string;
}

export const MessageSidebar: React.FC<MessageSidebarProps> = ({
  chats,
  isLoadingChats,
  selectedChat,
  onChatClick,
}) => {
  const { isMobileOrTablet } = usePageWidth();
  const [getCoachClientHealthHistory] =
    useLazyGetCoachClientHealthHistoryQuery();
  const [clientHealthHistoryAges, setClientHealthHistoryAges] = useState<
    Record<string, number | null>
  >({});

  const SidebarLoadingSkeleton = () => {
    return (
      <div>
        <div className="flex items-center gap-[44px] justify-between p-[16px]">
          <div className="w-full h-[10px] rounded-[24px] skeleton-gradient" />
          <div className="w-full h-[10px] rounded-[24px] skeleton-gradient" />
        </div>
        <div className="flex flex-col">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-[16px] p-[16px] border-b border-[#DBDEE1]"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-[40px] h-[40px] rounded-full skeleton-gradient flex-shrink-0" />
                  <div className="flex flex-col gap-[6px] w-full min-w-[150px]">
                    <div className="w-[80%] h-[10px] rounded-[24px] skeleton-gradient" />
                    <div className="w-[40%] h-[10px] rounded-[24px] skeleton-gradient" />
                  </div>
                </div>
                <div className="w-[33px] h-[10px] rounded-[24px] skeleton-gradient" />
              </div>
              <div className="flex flex-col gap-[16px]">
                <div className="w-[100%] h-[10px] rounded-[24px] skeleton-gradient" />
                <div className="w-[60%] h-[10px] rounded-[24px] skeleton-gradient" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  // const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) {
      setCanScrollUp(false);
      // setCanScrollDown(false);
      return;
    }

    const threshold = 1;
    const { scrollTop } = viewport;
    setCanScrollUp(scrollTop > threshold);
    // setCanScrollDown(scrollTop + clientHeight < scrollHeight - threshold);
  }, []);

  const setScrollViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const viewport = node.querySelector(
        ".scroll-area-viewport"
      ) as HTMLDivElement | null;
      if (viewport) {
        scrollViewportRef.current = viewport;
        viewport.classList.add("no-scrollbar");
        viewport.style.overflowY = "auto";
        viewport.style.overflowX = "hidden";
        updateScrollState();
      }
    },
    [updateScrollState]
  );

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const handleScroll = () => updateScrollState();

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    // viewport.addEventListener("wheel", preventNativeScroll, {
    //   passive: false,
    // });
    // viewport.addEventListener("touchmove", preventNativeScroll, {
    //   passive: false,
    // });
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(viewport);

    const content = viewport.firstElementChild;
    if (content) {
      resizeObserver.observe(content);
    }

    updateScrollState();

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      // viewport.removeEventListener("wheel", preventNativeScroll);
      // viewport.removeEventListener("touchmove", preventNativeScroll);
      resizeObserver.disconnect();
    };
  }, [chats.length, updateScrollState]);

  const [popoverOpenId, setPopoverOpenId] = useState<string | null>(null);
  const clientIds = useMemo(
    () =>
      Array.from(
        new Set(
          chats
            .map((chat) => chat.participants?.[0]?.id)
            .filter((id): id is string => Boolean(id))
        )
      ),
    [chats]
  );

  useEffect(() => {
    const missingClientIds = clientIds.filter(
      (clientId) => !(clientId in clientHealthHistoryAges)
    );

    if (!missingClientIds.length) {
      return;
    }

    let isCancelled = false;

    const fetchMissingAges = async () => {
      const fetchedAges = await Promise.all(
        missingClientIds.map(async (clientId) => {
          try {
            const healthHistory = await getCoachClientHealthHistory(
              clientId,
              true
            ).unwrap();
            const parsedAge = Number(healthHistory?.age);
            const age =
              Number.isFinite(parsedAge) && parsedAge > 0 ? parsedAge : null;

            return { clientId, age };
          } catch {
            return { clientId, age: null };
          }
        })
      );

      if (isCancelled) {
        return;
      }

      setClientHealthHistoryAges((prev) => {
        const next = { ...prev };
        fetchedAges.forEach(({ clientId, age }) => {
          next[clientId] = age;
        });
        return next;
      });
    };

    fetchMissingAges();

    return () => {
      isCancelled = true;
    };
  }, [clientIds, clientHealthHistoryAges, getCoachClientHealthHistory]);
  const clientChats = chats.filter((item) => item.type !== "coach");
  const coachChats = chats.filter((item) => item.type === "coach");

  return (
    <aside
      className={`flex flex-col w-full lg:w-[116px] overflow-x-hidden p-[24px] no-scrollbar ${isMobileOrTablet ? "h-[calc(100vh-110px)]" : "h-[calc(100vh-65px)]"}`}
    >
      {isLoadingChats && (
        <div className="xl:hidden flex gap-[12px] px-[20px] py-[10px] bg-white border border-[#ECEFF4] text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </span>
          Please wait, we are loading the information...
        </div>
      )}

      {isLoadingChats ? (
        <SidebarLoadingSkeleton />
      ) : isMobileOrTablet ? (
        <Tabs defaultValue="clients" className="w-full lg:w-fit h-full">
          <ScrollArea className="h-full bg-white border border-[#ECEFF4] rounded-[16px] w-full lg:w-fit pt-[16px]">
            <TabsContent value="clients" className="mt-0">
              {clientChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                  <p className="font-semibold">No client conversations</p>
                  <p className="text-sm">
                    Start a conversation with a client to see it here.
                  </p>
                </div>
              ) : (
                clientChats.map((item) => (
                  <ChatItem
                    key={item.id}
                    item={item}
                    onClick={() => onChatClick(item)}
                    classname={
                      selectedChat?.id === item.id
                        ? "bg-[#1C63DB] opacity-[70%] text-white"
                        : ""
                    }
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="coaches" className="mt-0">
              {coachChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                  <p className="font-semibold">No coach conversations</p>
                  <p className="text-sm">
                    You haven’t started chatting with any coach yet.
                  </p>
                </div>
              ) : (
                coachChats.map((item) => (
                  <ChatItem
                    key={item.id}
                    item={item}
                    onClick={() => onChatClick(item)}
                    classname={
                      selectedChat?.id === item.id
                        ? "bg-[#1C63DB] opacity-[70%] text-white"
                        : ""
                    }
                  />
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      ) : (
        <ScrollArea
          showScrollbar={false}
          className="h-full bg-white rounded-[16px] border border-[#ECEFF4] w-full lg:w-fit no-scrollbar relative overflow-hidden"
          ref={setScrollViewportRef}
        >
          <Dock
            className={`relative h-full w-[64px] flex flex-col border-none mt-0 p-[16px] rounded-[16px] pb-[60px]`}
            iconSize={40}
            iconMagnification={60}
            iconDistance={60}
          >
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#5F5F65]">
                <p className="font-semibold">No conversations</p>
                <p className="text-sm">
                  Start a conversation with a client to see it here.
                </p>
              </div>
            ) : (
              chats.map((item) => (
                <DockIcon
                  key={item.id}
                  className="hover:scale-[1.3] transition-transform duration-500"
                >
                  <Popover
                    open={popoverOpenId === item.id}
                    onOpenChange={(open) =>
                      setPopoverOpenId(open ? item.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <div
                        onMouseEnter={() => setPopoverOpenId(item.id)}
                        onMouseLeave={() => setPopoverOpenId(null)}
                      >
                        <ChatItem
                          item={item}
                          onClick={() => onChatClick(item)}
                          classname={
                            selectedChat?.id === item.id
                              ? "bg-[#1C63DB] opacity-[70%] text-white"
                              : ""
                          }
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      arrow={false}
                      sideOffset={8}
                      className="min-w-[195px] max-w-[350px] border-none"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-base text-black">
                          {(() => {
                            const participant = item?.participants?.[0];
                            const displayName = participant?.first_name
                              ? `${participant.first_name} ${participant.last_name}`
                              : participant?.name
                                ? participant.name
                                : item.name;
                            const age = participant?.id
                              ? clientHealthHistoryAges[participant.id]
                              : undefined;

                            return age != null
                              ? `${displayName}, ${age}`
                              : displayName;
                          })()}
                        </div>
                        <div className="text-sm text-[#5F5F65]">
                          {item.participants?.[0]?.email}
                        </div>
                        <div className="text-sm text-[#5F5F65]">
                          Last activity:{" "}
                          {item.lastMessageAt
                            ? timeAgo(item.lastMessageAt)
                            : "—"}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </DockIcon>
              ))
            )}
          </Dock>
          {canScrollUp && (
            <button
              className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-white border-b border-[#ECEFF4] rounded-t-[16px] w-full p-1 flex items-center justify-center"
              onClick={() => {
                const viewport = scrollViewportRef.current;
                if (viewport) {
                  viewport.scrollBy({ top: -200, behavior: "smooth" });
                }
              }}
              aria-label="Scroll chat list up"
              type="button"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M8 14l4-4 4 4"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* {canScrollDown && ( */}
          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 bg-white border-t border-[#ECEFF4] shadow-md rounded-b-[16px] w-full p-1 flex items-center justify-center"
            onClick={() => {
              const viewport = scrollViewportRef.current;
              if (viewport) {
                viewport.scrollBy({ top: 200, behavior: "smooth" });
              }
            }}
            aria-label="Scroll chat list down"
            type="button"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 10l4 4 4-4"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* )} */}
        </ScrollArea>
      )}
    </aside>
  );
};
