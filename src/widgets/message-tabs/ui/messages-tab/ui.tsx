import Plus from "shared/assets/icons/plus";
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
import { Loader2Icon, Send, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Smiley from "shared/assets/icons/smiley";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import { cn, usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { useFilePicker } from "./useFilePicker";
import { useNavigate } from "react-router-dom";
import { DaySeparator } from "../components/DaySeparator";
import { dayKey, formatDayLabel } from "widgets/message-tabs/helpers";

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

export const MessagesTab: React.FC<MessagesTabProps> = ({ chat, search }) => {
  const nav = useNavigate();
  const { isMobile, isTablet, isMobileOrTablet } = usePageWidth();
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstScrollRef = useRef<HTMLDivElement>(null);

  const profile = useSelector((state: RootState) => state.user.user);
  const {
    items,
    files,
    open,
    getInputProps,
    remove,
    getDropzoneProps,
    dragOver,
  } = useFilePicker({
    accept: ["application/pdf", "image/jpeg", "image/png"],
    maxFiles: 4,
    maxFileSize: 10 * 1024 * 1024,
  });
  const [page, setPage] = useState<number>(1);
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);

  const hasNext = useRef(false);

  const loadMessages = async (page: number) => {
    if (loadingMore) return;

    try {
      setLoading(true);
      const res = await ChatService.fetchChatMessages(chat.chat_id, { page });
      setMessages((prev) => {
        const newMessages =
          page === 1 ? res.messages : [...prev, ...res.messages];
        return getUniqueMessages(newMessages);
      });

      if (page === 1) {
        firstScrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }

      hasNext.current = res.has_next;
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      if (scrollElement.scrollTop === 0 && !loadingMore && hasNext.current) {
        setLoadingMore(true);
        setPage((prevPage) => {
          const newPage = prevPage + 1;
          loadMessages(newPage);
          return newPage;
        });
      }
    }
  };

  useEffect(() => {
    if (chat?.chat_id) {
      loadMessages(page);
    }
  }, [chat?.chat_id, page]);

  const handleNewMessage = (msg: ChatMessageModel) => {
    if (msg.chat_id !== chat?.chat_id) return;
    setMessages((prev) => {
      return prev.some((m) => m.id === msg.id) ? prev : [msg, ...prev];
    });
    setTimeout(() => {
      firstScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollRef.current, loadingMore]);

  useEffect(() => {
    ChatSocketService.on("new_message", handleNewMessage);

    return () => {
      ChatSocketService.off("new_message", handleNewMessage);
    };
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
      setTimeout(
        () => firstScrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="w-8 h-8 text-blue-500 animate-spin" />
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
  if (isMobile) {
    currentStyle = containerStyle;
  } else if (isTablet) {
    currentStyle = containerStyleMd;
  }

  const renderSend = () => {
    if (sending) {
      return <Loader2Icon className="animate-spin" />;
    }

    return isMobileOrTablet ? <Send width={23} height={23} /> : "Send";
  };

  return (
    <>
      <div
        ref={scrollRef}
        style={currentStyle}
        className="w-full pr-3 overflow-auto custom-message-scroll"
      >
        <div className="flex flex-col justify-end gap-2 pb-4 mt-auto">
          {loadingMore && (
            <div className="flex items-center justify-center mb-2">
              <Loader2Icon className="animate-spin" />
            </div>
          )}
          {(() => {
            const sorted = [...messages]
              .sort((a, b) => {
                const da = new Date(a.created_at || 0).getTime();
                const db = new Date(b.created_at || 0).getTime();
                return da - db;
              })
              .filter((msg) => {
                if (!search) return true;

                return msg.content.toLowerCase().includes(search.toLowerCase());
              });

            const nodes: React.ReactNode[] = [];
            let lastKey: string | null = null;

            for (let i = 0; i < sorted.length; i++) {
              const msg = sorted[i];
              const d = new Date(msg.created_at || 0);
              const k = dayKey(d);

              if (k !== lastKey) {
                nodes.push(
                  <DaySeparator
                    key={`sep-${k}-${i}`}
                    label={formatDayLabel(d)}
                  />
                );
                lastKey = k;
              }

              nodes.push(
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  avatar={
                    chat.chat_type === "group" ? undefined : chat.avatar_url
                  }
                  isOwn={msg.sender?.email === profile?.email}
                  author={msg.sender?.name || "Unknown User"}
                />
              );
            }

            return nodes;
          })()}
          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-center lg:mt-40">
              <img src={EmptyChat} alt="No files" className="mb-6 md:mb-12" />
              <h1 className="text-lg md:text-3xl font-bold text-[#1D1D1F]">
                There are no messages yet...
              </h1>
              <p className="mt-2 text-base md:text-xl text-[#5F5F65]">
                Start a conversation with your coach if you have a question or
                need support.
              </p>
            </div>
          )}
          <div ref={firstScrollRef} />
        </div>
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
            <div className="flex flex-col w-full">
              {files.length > 0 && (
                <div className="mе-1">
                  <p className="text-sm font-medium text-[#1D1D1F]">
                    Attached Files:
                  </p>
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
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <input {...getInputProps()} className="hidden" />
                  <Button value={"ghost"} className="p-0" onClick={open}>
                    <Plus />
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
                      <Smiley />
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
