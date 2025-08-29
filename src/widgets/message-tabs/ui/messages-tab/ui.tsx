import { MessageBubble } from "widgets/message-bubble";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  ChatMessageModel,
  ChatService,
  ChatSocketService,
  DetailsChatItemModel,
} from "entities/chat";
import { RootState } from "entities/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import { cn, toast, usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { useFilePicker } from "../../../../shared/hooks/useFilePicker";
import { useNavigate } from "react-router-dom";
import { DaySeparator } from "../components/DaySeparator";
import { dayKey, formatDayLabel } from "widgets/message-tabs/helpers";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { ChatScroller } from "../components/ChatScroller";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { EmptyCoachChat } from "../components/EmptyCoachChat";

function getUniqueMessages(messages: ChatMessageModel[]): ChatMessageModel[] {
  const seen = new Set<string>();
  return messages.filter((msg) => {
    if (seen.has(msg.id)) return false;
    seen.add(msg.id);
    return true;
  });
}

interface MessagesTabProps {
  search?: string;
  chat: DetailsChatItemModel;
}

type ListItem =
  | { type: "separator"; key: string; label: string }
  | { type: "message"; key: string; msg: ChatMessageModel };

export const MessagesTab: React.FC<MessagesTabProps> = ({ chat, search }) => {
  const nav = useNavigate();
  const { isMobile, isTablet, isMobileOrTablet } = usePageWidth();
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");

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
  } = useFilePicker({
    accept: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 10 * 1024 * 1024,
  });

  const activeChatIdRef = useRef<string | undefined>(undefined);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);
  const prevLenRef = useRef(0);

  const initializingRef = useRef(true);

  const [page, setPage] = useState<number>(1);
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);
  const hasNext = useRef(false);

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
    return out;
  }, [messages, search]);

  const loadMessages = async (page: number) => {
    if (!chat?.chat_id) return;
    if (loadingMore && page !== 1) return;

    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const currentChatId = chat.chat_id;
      const res = await ChatService.fetchChatMessages(currentChatId, { page });

      if (activeChatIdRef.current !== currentChatId) return;

      setMessages((prev) => {
        const merged = page === 1 ? res.messages : [...prev, ...res.messages];
        return getUniqueMessages(merged);
      });

      hasNext.current = res.has_next;
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({ title: "Failed to load messages", variant: "destructive" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!chat?.chat_id) return;
    activeChatIdRef.current = chat.chat_id;

    initializingRef.current = true;

    setMessages([]);
    setPage(1);
    hasNext.current = false;
    setAtBottom(true);
    prevLenRef.current = 0;
    setInput("");
    setEmojiModalOpen(false);
    clear();
    setLoading(true);

    (async () => {
      await loadMessages(1);
      if (activeChatIdRef.current === chat.chat_id) {
        const api = virtuosoRef.current;
        if (api) {
          api.scrollTo({ top: Number.MAX_SAFE_INTEGER });
          requestAnimationFrame(() => {
            api.scrollToIndex({
              index: Math.max(0, listData.length - 1),
              align: "end",
            });
            requestAnimationFrame(() => {
              initializingRef.current = false;
            });
          });
        } else {
          initializingRef.current = false;
        }
      } else {
        initializingRef.current = false;
      }
    })();
  }, [chat?.chat_id]);

  useEffect(() => {
    const onNew = (msg: ChatMessageModel) => {
      if (msg.chat_id !== chat?.chat_id) return;
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [msg, ...prev]
      );
    };

    ChatSocketService.on("new_message", onNew);
    return () => ChatSocketService.off("new_message", onNew);
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
        setMessages((prev) => [optimistic, ...prev]);
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

      setMessages((prev) => [optimistic, ...prev]);
      setInput("");

      const newMsg = await ChatService.sendMessage({
        content: optimistic.content,
        message_type: "text",
        reply_to_message_id: undefined,
        chat_id: chat.chat_type === "new_chat" ? undefined : chat.chat_id,
        target_user_id:
          chat.chat_type === "new_chat" ? chat.chat_id : undefined,
      });

      if (chat.chat_type === "new_chat") {
        nav(`/content-manager/messages/${newMsg.chat_id}`);
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? newMsg : m))
      );
      chat.chat_id = newMsg.chat_id;
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("tmp-")));
    } finally {
      setSending(false);

      if (atBottom) {
        requestAnimationFrame(() => scrollToBottom("smooth"));
      }
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
    const prev = prevLenRef.current;
    const curr = listData.length;

    if (prev === 0 && curr > 0) {
      virtuosoRef.current?.scrollTo({ top: Number.MAX_SAFE_INTEGER });
      requestAnimationFrame(() =>
        virtuosoRef.current?.scrollToIndex({ index: curr - 1, align: "end" })
      );
    } else if (curr > prev && atBottom) {
      virtuosoRef.current?.scrollToIndex({
        index: curr - 1,
        align: "end",
        behavior: "smooth",
      });
    }

    prevLenRef.current = curr;
  }, [listData.length, atBottom]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <MaterialIcon
          iconName="progress_activity"
          className="text-blue-500 animate-spin"
        />
      </div>
    );
  }

  const receiver = chat.participants?.find(
    (p) => p.user.email !== profile?.email
  );

  const isClient = profile?.roleName === "Client";
  const filesDivHeight = files.length > 0 ? 64 : 0;

  const containerStyle = {
    height: isClient
      ? `calc(100vh - ${372.5 + filesDivHeight}px)`
      : `calc(100vh - ${384.5 + filesDivHeight}px)`,
  };

  const containerStyleMd = {
    height: isClient
      ? `calc(100vh - ${489 + filesDivHeight}px)`
      : `calc(100vh - ${409 + filesDivHeight}px)`,
  };

  const containerStyleLg = {
    height: isClient
      ? `calc(100vh - ${316 + filesDivHeight}px)`
      : `calc(100vh - ${394 + filesDivHeight}px)`,
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

  const showScrollBtn = !atBottom;
  const scrollToBottom = (behavior: "auto" | "smooth" | undefined = "auto") => {
    const api = virtuosoRef.current;
    if (!api || listData.length === 0) return;

    api.scrollTo({ top: Number.MAX_SAFE_INTEGER, behavior });

    requestAnimationFrame(() => {
      api.scrollToIndex({
        index: listData.length - 1,
        align: "end",
        behavior,
      });

      requestAnimationFrame(() => {
        api.scrollTo({ top: Number.MAX_SAFE_INTEGER, behavior });
      });
    });
  };

  const rendeerEmptyState = () => {
    if (profile?.roleName === "Client") {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img src={EmptyChat} alt="No files" className="mb-6 md:mb-12" />
          <h1 className="text-lg md:text-3xl font-bold text-[#1D1D1F]">
            There are no messages yet...
          </h1>
          <p className="mt-2 text-base md:text-xl text-[#5F5F65]">
            Start a conversation with your coach if you have a question or need
            support.
          </p>
        </div>
      );
    }

    return <EmptyCoachChat />;
  };

  return (
    <>
      <div style={currentStyle} className="relative w-full pr-3">
        {listData.length === 0 ? (
          rendeerEmptyState()
        ) : (
          <Virtuoso
            key={chat.chat_id || "no-chat"}
            ref={virtuosoRef}
            style={{ height: "100%" }}
            data={listData}
            initialTopMostItemIndex={Math.max(0, listData.length - 1)}
            itemContent={(_, item) =>
              item.type === "separator" ? (
                <DaySeparator key={item.key} label={item.label} />
              ) : (
                <MessageBubble
                  key={item.key}
                  message={item.msg}
                  avatar={
                    chat.chat_type === "group" ? undefined : chat.avatar_url
                  }
                  isOwn={item.msg.sender?.email === profile?.email}
                  author={item.msg.sender?.name || "Unknown User"}
                />
              )
            }
            computeItemKey={(_, item) => item.key}
            alignToBottom
            followOutput="smooth"
            atBottomStateChange={setAtBottom}
            startReached={async () => {
              if (initializingRef.current) return;
              if (loadingMore) return;
              if (!hasNext.current) return;

              const next = page + 1;
              setPage(next);
              await loadMessages(next);
            }}
            increaseViewportBy={{ top: 200, bottom: 400 }}
            components={{
              Scroller: ChatScroller,
              Footer: () =>
                loadingMore ? (
                  <div className="flex justify-center py-2">
                    <MaterialIcon
                      iconName="progress_activity"
                      className="w-5 h-5 animate-spin"
                    />
                  </div>
                ) : null,
            }}
          />
        )}

        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom("auto")}
            className="absolute h-10 p-2 text-white transition bg-blue-500 rounded-full shadow-lg right-4 -bottom-12 hover:bg-blue-600"
          >
            <MaterialIcon iconName="keyboard_arrow_down" />
          </button>
        )}
      </div>

      <div className="pt-2">
        <Textarea
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
              {files.length > 0 && (
                <div className="mt-1">
                  <p className="text-sm font-medium">Attached Files:</p>
                  <div className="flex max-w-[800px] gap-4 mt-2 overflow-x-auto">
                    {items.map((file) => (
                      <div key={file.id} className="flex items-center gap-2">
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-[#4B5563] text-nowrap max-w-20 truncate">
                            {file.file.name}
                          </span>
                          <span className="text-xs text-[#6B7280]">
                            {(file.file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={() => remove(file.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                          title="Remove File"
                        >
                          <MaterialIcon iconName="delete" className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between w-full ">
                <div className="flex items-center gap-4">
                  <input {...getInputProps()} className="hidden" />
                  <Button value={"ghost"} className="p-0" onClick={open}>
                    <MaterialIcon iconName="add" className="text-[#1D1D1F]" />
                  </Button>
                  <div className="relative">
                    <Button
                      value={"ghost"}
                      className="p-0"
                      onClick={(e) => {
                        setEmojiModalOpen(true);
                        e.stopPropagation();
                      }}
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
                  disabled={sending}
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
