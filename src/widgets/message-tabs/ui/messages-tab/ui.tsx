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
import { applyIncomingMessage, updateChat } from "entities/chat/chatsSlice";
import { RootState } from "entities/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import { cn, toast, usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { dayKey, formatDayLabel } from "widgets/message-tabs/helpers";
import { useFilePicker } from "../../../../shared/hooks/useFilePicker";
import { ChatScroller } from "../components/ChatScroller";
import { DaySeparator } from "../components/DaySeparator";
import { EmptyCoachChat } from "../components/EmptyCoachChat";
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
}

type ListItem =
  | { type: "separator"; key: string; label: string }
  | { type: "message"; key: string; msg: ChatMessageModel };

export const MessagesTab: React.FC<MessagesTabProps> = ({
  chat,
  search,
  sendMessage,
  loadMessages,
}) => {
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
  } = useFilePicker({
    accept: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 10 * 1024 * 1024,
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);

  const [page, setPage] = useState<number>(1);
  const [atBottom, setAtBottom] = useState(true);
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [firstItemIndex, setFirstItemIndex] = useState<number>(0);
  const [hasNext, setHasNext] = useState(true);

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

    return out;
  }, [messages, search]);

  useEffect(() => {
    if (!chat?.chat_id) return;

    setMessages([]);
    setFirstItemIndex(0);
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

      dispatch(
        applyIncomingMessage({ msg: newMsg, activeChatId: chat.chat_id })
      );
      if (chat.chat_type === "new_chat") {
        nav(`/content-manager/messages/${newMsg.chat_id}`);
      }

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

        setFirstItemIndex((idx) => idx - toPrepend.length);
        return [...toPrepend, ...prev];
      });

      setPage(nextPage);
      setHasNext(res.has_next);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasNext, chat?.chat_id, page, loadMessages]);

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

  const VirtuosoHeaderComponent = () => (
    <VirtuosoHeader loadingMore={loadingMore} hasMore={hasNext} />
  );

  return (
    <>
      <div style={currentStyle} className="relative w-full pr-3">
        {listData.length === 0 ? (
          rendeerEmptyState()
        ) : (
          <Virtuoso
            key={chat.chat_id}
            ref={virtuosoRef}
            startReached={loadOlder}
            style={{ height: "100%" }}
            data={listData}
            initialTopMostItemIndex={firstItemIndex}
            computeItemKey={(_, item) => item.key}
            atBottomStateChange={setAtBottom}
            alignToBottom
            followOutput="smooth"
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
            components={{
              Scroller: ChatScroller,
              Header: VirtuosoHeaderComponent,
            }}
          />
        )}

        {!atBottom && (
          <button
            onClick={() =>
              virtuosoRef.current?.scrollTo({
                top: Number.MAX_SAFE_INTEGER,
                behavior: "auto",
              })
            }
            className="absolute h-10 p-2 text-white transition bg-blue-500 rounded-full shadow-lg right-4 -bottom-12 hover:bg-blue-600"
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
                          <MaterialIcon iconName="delete" fill={1} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between w-full ">
                <div className="flex items-center gap-4">
                  <input {...getInputProps()} className="hidden" />
                  <Button
                    value={"ghost"}
                    className="p-0"
                    onClick={open}
                    disabled={isToluAdmin}
                  >
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
