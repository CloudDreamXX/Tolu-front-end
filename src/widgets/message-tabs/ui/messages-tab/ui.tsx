import { MessageBubble } from "widgets/message-bubble";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  ChatMessageModel,
  ChatService,
  ChatSocketService,
  DetailsChatItemModel,
  FetchChatMessagesResponse,
} from "entities/chat";
import { useFetchAllChatsQuery } from "entities/chat/chatApi";
import { applyIncomingMessage, updateChat } from "entities/chat/chatsSlice";
import { RootState } from "entities/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast, usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { PopoverAttach } from "widgets/content-popovers";
import { dayKey, formatDayLabel } from "widgets/message-tabs/helpers";
import { useFilePicker } from "../../../../shared/hooks/useFilePicker";
import { DaySeparator, NewMessagesSeparator } from "../components/Separator";
import { VirtuosoHeader } from "../components/VirtuosoHeader";

function uniqById(messages: ChatMessageModel[]): ChatMessageModel[] {
  const seen = new Set<string>();
  return messages.filter((msg) => {
    if (seen.has(msg.id)) return false;
    seen.add(msg.id);
    return true;
  });
}

interface MessagesTabProps {
  chat: DetailsChatItemModel;
  sendMessage: (content: string) => Promise<ChatMessageModel | undefined>;
  loadMessages: (
    page: number,
    pageSize?: number
  ) => Promise<FetchChatMessagesResponse | undefined>;
  search?: string;
  refetch?: () => void;
}

type ListItem =
  | { type: "separator"; key: string; label: string }
  | { type: "separator-new"; key: string; label: string }
  | { type: "message"; key: string; msg: ChatMessageModel };

export const MessagesTab: React.FC<MessagesTabProps> = ({
  chat,
  search,
  sendMessage,
  loadMessages,
  refetch,
}) => {
  const { refetch: refetchChats } = useFetchAllChatsQuery();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { isMobile, isTablet, isMobileOrTablet } = usePageWidth();
  const profile = useSelector((state: RootState) => state.user.user);
  const {
    items,
    files,
    open,
    getInputProps,
    remove,
    getDropzoneProps,
    dragOver,
    clear,
    setFiles,
  } = useFilePicker({
    accept: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 10 * 1024 * 1024,
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [atBottom, setAtBottom] = useState(true);
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);

  const [hasNext, setHasNext] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isToluAdmin = chat?.name?.toLowerCase() === "tolu admin";

  const listData: ListItem[] = useMemo(() => {
    const sorted = [...messages]
      .sort(
        (a, b) =>
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
      )
      .filter((m) =>
        search
          ? (m.content || "").toLowerCase().includes(search.toLowerCase())
          : true
      );

    const out: ListItem[] = [];
    let lastKey: string | null = null;

    for (let i = 0; i < sorted.length; i++) {
      const msg = sorted[i];
      const d = new Date(msg.created_at || 0);
      const k = dayKey(d);
      if (k !== lastKey) {
        out.push({
          type: "separator",
          key: `sep-${k}-${i}`,
          label: formatDayLabel(d),
        });
        lastKey = k;
      }
      out.push({ type: "message", key: msg.id, msg });
    }

    if (chat.unread_count > 0) {
      const insertIndex = out.length - chat.unread_count;
      out.splice(insertIndex, 0, {
        type: "separator-new",
        key: `sep-new-${chat.unread_count}`,
        label: "New Messages",
      });
    }

    return out;
  }, [messages, search, chat.unread_count]);

  useEffect(() => {
    if (chat.unread_count > 0) {
      const timer = setTimeout(() => {
        dispatch(updateChat({ id: chat.chat_id, changes: { unreadCount: 0 } }));
        refetch?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [chat.unread_count]);

  useEffect(() => {
    if (!chat?.chat_id) return;

    setMessages([]);
    setPage(1);
    setHasNext(true);
    setLoadingInitial(true);
    setAtBottom(true);
    setInput("");
    setEmojiModalOpen(false);
    clear();

    const init = async () => {
      try {
        const res = await loadMessages(1);
        if (!res) return;

        setMessages(uniqById(res.messages));
        setHasNext(res.has_next);
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to load messages", variant: "destructive" });
      } finally {
        setLoadingInitial(false);
      }
    };

    init();
  }, [chat?.chat_id]);

  const handleNewMessage = (msg: ChatMessageModel) => {
    if (msg.chat_id !== chat?.chat_id) return;
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) {
        return prev;
      }
      return [...prev, msg];
    });
  };

  useEffect(() => {
    ChatSocketService.on("new_message", handleNewMessage);
    return () => ChatSocketService.off("new_message", handleNewMessage);
  }, [chat?.chat_id]);

  const sendAll = async () => {
    if (!input.trim() && files.length === 0) return;

    const optimistic: ChatMessageModel = {
      id: `tmp-${Date.now()}`,
      content: input,
      chat_id: "",
      created_at: new Date().toISOString(),
      file_url: null,
      file_name: null,
      file_size: null,
      file_type: null,
      sender: {
        id: profile?.id || "",
        name: profile?.name || "You",
        email: profile?.email || "",
      },
    };

    setSending(true);

    for (const it of items) {
      const file = it.file;
      try {
        setMessages((prev) => [...prev, optimistic]);
        const response = await ChatService.uploadChatFile(chat.chat_id, file);
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? response.message : m))
        );
        remove(it.id);
      } catch (e) {
        console.error("file upload failed", e);
      }
    }

    try {
      if (optimistic.content.trim() === "") return;

      setMessages((prev) => [...prev, optimistic]);
      setInput("");

      const newMsg = await sendMessage(optimistic.content);
      if (!newMsg) throw new Error("Failed to send message");

      if (chat.chat_type === "new_chat") {
        nav(`/content-manager/messages/${newMsg.chat_id}`);
        refetchChats();
      }

      dispatch(
        applyIncomingMessage({ msg: newMsg, activeChatId: chat.chat_id })
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? newMsg : m))
      );
      chat.chat_id = newMsg.chat_id;
    } catch {
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("tmp-")));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();
      sendAll();
    }
  };

  useEffect(() => {
    if (!chat.chat_id) return;
    if (!atBottom) return;
    dispatch(updateChat({ id: chat.chat_id, changes: { unreadCount: 0 } }));
  }, [chat.chat_id, atBottom]);

  const loadOlder = useCallback(async () => {
    if (loadingMore || !hasNext || !chat?.chat_id) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await loadMessages(nextPage);
      if (!res) return;

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        const toPrepend = res.messages.filter((m) => !ids.has(m.id));
        if (toPrepend.length === 0) return prev;
        return [...toPrepend, ...prev];
      });

      setPage(nextPage);
      setHasNext(res.has_next);
      setHasNewMessages(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasNext, chat?.chat_id, page, loadMessages]);

  const receiver = chat.participants?.find(
    (p) => p.user.email !== profile?.email
  );

  const isClient = profile?.roleName === "Client";

  const containerStyle = {
    height: isClient ? `calc(100vh - 372.5px)` : `calc(100vh - 384.5px)`,
  };

  const containerStyleMd = {
    height: isClient ? `calc(100vh - 489px)` : `calc(100vh - 409px)`,
  };

  const containerStyleLg = {
    height: isClient ? `calc(100vh - 322px)` : `calc(100vh - 396px)`,
  };

  let currentStyle = containerStyleLg;
  if (isMobile) currentStyle = containerStyle;
  else if (isTablet) currentStyle = containerStyleMd;

  const renderSend = () => {
    if (sending) {
      return (
        <MaterialIcon
          iconName="progress_activity"
          className="text-blue-600 animate-spin"
        />
      );
    }

    return isMobileOrTablet ? (
      <MaterialIcon iconName="send" className="w-5 h-5" />
    ) : (
      "Send"
    );
  };

  const rendeerEmptyState = () => {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <p className="text-[18px] md:text-[20px] font-[500] text-[#1D1D1F]">
          There are no messages
        </p>
      </div>
    );
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      setAtBottom(true);
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    setPreviousScrollHeight(0);
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop === 0) {
      setPreviousScrollHeight(scrollHeight);
      loadOlder();
    }

    setAtBottom(scrollTop + clientHeight === scrollHeight);

    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceFromBottom > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    if (atBottom) {
      scrollToBottom();
    } else if (chatContainerRef.current && previousScrollHeight > 0) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight - previousScrollHeight;
      setPreviousScrollHeight(0);
    }
  }, [messages, atBottom]);

  useEffect(() => {
    if (hasNewMessages && atBottom) {
      scrollToBottom();
      setHasNewMessages(false);
    }
  }, [hasNewMessages, atBottom]);

  const renderItems = (item: ListItem) => {
    switch (item.type) {
      case "separator":
        return <DaySeparator key={item.key} label={item.label} />;
      case "separator-new":
        return <NewMessagesSeparator key={item.key} label={item.label} />;
      case "message":
      default:
        return (
          <MessageBubble
            key={item.key}
            message={item.msg}
            avatar={chat.chat_type === "group" ? undefined : chat.avatar_url}
            isOwn={item.msg.sender?.email === profile?.email}
            author={item.msg.sender?.name || "Unknown User"}
          />
        );
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center h-full">
        <MaterialIcon
          iconName="progress_activity"
          className="text-blue-500 animate-spin"
        />
      </div>
    );
  }

  return (
    <>
      <div style={currentStyle} className="relative w-full pr-3">
        {listData.length === 0 ? (
          rendeerEmptyState()
        ) : (
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="relative w-full h-full px-4 overflow-y-auto chat-scroller"
          >
            <div>
              <VirtuosoHeader loadingMore={loadingMore} hasMore={hasNext} />
              {listData.map(renderItems)}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {hasNewMessages && !atBottom && (
          <div className="absolute p-2 text-center text-white -translate-x-1/2 bg-blue-500 rounded-full left-1/2 bottom-4">
            <p>New messages</p>
          </div>
        )}

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute h-10 p-2 text-white transition bg-blue-500 rounded-full shadow-lg right-4 -bottom-4 hover:bg-blue-600"
          >
            <MaterialIcon iconName="keyboard_arrow_down" />
          </button>
        )}
      </div>

      <div className="pt-2">
        <Textarea
          disabled={isToluAdmin}
          placeholder={`Message ${receiver?.user.name}`}
          className={cn("resize-none min-h-[80px]")}
          containerClassName={cn(
            "px-4 py-3",
            dragOver ? "border-2 border-dashed border-blue-500" : undefined
          )}
          value={input}
          onValueChange={setInput}
          onKeyDown={handleKeyPress}
          {...getDropzoneProps()}
          onClick={() => ({})}
          footer={
            <div className="flex flex-col w-full text-[#1D1D1F]">
              <div className="flex items-center justify-between w-full ">
                <div className="flex items-center gap-4">
                  <input {...getInputProps()} className="hidden" />
                  {isClient ? (
                    <label
                      className={`relative items-center text-gray-600 transition-colors rounded-lg cursor-pointer hover:text-gray-800 hidden md:flex`}
                    >
                      <Button
                        variant="ghost"
                        className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                        onClick={open}
                        disabled={isToluAdmin}
                      >
                        <MaterialIcon iconName="attach_file" />
                      </Button>
                      {files.length > 0 && (
                        <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -left-1">
                          {files.length > 99 ? "99+" : files.length}
                        </span>
                      )}
                    </label>
                  ) : (
                    <PopoverAttach
                      files={files}
                      setFiles={setFiles}
                      disabled={isToluAdmin}
                      title="Attach files"
                      customTrigger={
                        <Button
                          variant="ghost"
                          className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-10 h-10 hover:bg-secondary/80"
                        >
                          <MaterialIcon
                            iconName="attach_file"
                            size={24}
                            fill={1}
                          />
                          {files.length > 0 && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                              {files.length > 99 ? "99+" : files.length}
                            </span>
                          )}
                        </Button>
                      }
                    />
                  )}

                  <div className="relative">
                    <Button
                      value={"ghost"}
                      className="p-0"
                      onClick={(e) => {
                        setEmojiModalOpen(true);
                        e.stopPropagation();
                      }}
                      disabled={isToluAdmin}
                    >
                      <MaterialIcon
                        iconName="sentiment_satisfied"
                        className="text-[#1D1D1F]"
                      />
                    </Button>

                    {emojiModalOpen && (
                      <div className="absolute mb-2 bottom-full">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            setInput((prev) => prev + emoji.native);
                          }}
                          onClickOutside={() => setEmojiModalOpen(false)}
                          theme="light"
                          previewPosition="none"
                          skinTonePosition="none"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={sendAll}
                  disabled={sending || isToluAdmin}
                  variant={isMobileOrTablet ? "brightblue" : "blue"}
                  className="rounded-full flex justify-center items-center
             w-[42px] h-[42px] lg:w-[128px]"
                >
                  {renderSend()}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};
