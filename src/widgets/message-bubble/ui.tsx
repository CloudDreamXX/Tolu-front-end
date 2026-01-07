import { ChatMessageModel } from "entities/chat";
import React, { useEffect, useRef, useState } from "react";
import { cn, toast, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";
import { FileItem } from "widgets/file-item";
import { toUserTZ } from "widgets/message-tabs/helpers";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  useAddMessageReactionMutation,
  useDeleteMessageReactionMutation,
} from "entities/chat/api";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";

interface MessageBubbleProps {
  message: ChatMessageModel;
  chatId: string;
  avatar?: string;
  author?: string;
  isOnlaine?: boolean;
  isOwn?: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  chatId,
  avatar,
  author,
  isOnlaine = false,
  isOwn = false,
  className = "",
}) => {
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);
  const [localReactions, setLocalReactions] = useState(message.reactions ?? []);

  useEffect(() => {
    setLocalReactions(message.reactions ?? []);
  }, [message.reactions]);

  const user = useSelector((state: RootState) => state.user.user);

  const [addReaction] = useAddMessageReactionMutation();
  const [deleteReaction] = useDeleteMessageReactionMutation();

  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [pickerPosition, setPickerPosition] = useState<{
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  }>({ vertical: "bottom", horizontal: "left" });

  const { isMobile } = usePageWidth();
  const instant = toUserTZ(message.created_at);

  const isFileMessage =
    message.file_name !== null &&
    message.file_size !== null &&
    message.file_url !== null;

  const renderFileMessage = () => (
    <div
      className={cn(
        "rounded-lg  p-2 text-base text-[#1D1D1F] flex flex-wrap gap-2 w-fit",
        isOwn
          ? "bg-[#AAC6EC] rounded-tr-none"
          : "bg-white border border-[#DBDEE1] rounded-tl-none",
        className
      )}
    >
      <FileItem
        key={message.id}
        fileName={message.file_name}
        fileSize={message.file_size}
        fileUrl={message.file_url}
        fileType={message.file_type}
        className={cn(isOwn ? "bg-white " : "bg-[#AAC6EC]")}
      />
    </div>
  );

  const renderTextMessage = () => (
    <div
      className={cn(
        "inline-block rounded-lg px-[14px] py-[10px] text-base text-[#1D1D1F] max-w-full overflow-hidden break-words [overflow-wrap:anywhere] whitespace-pre-wrap [&_a]:break-all",
        isOwn
          ? "bg-[#AAC6EC] rounded-tr-none self-end"
          : "bg-white border border-[#DBDEE1] rounded-tl-none",
        className
      )}
    >
      {message.content}
    </div>
  );

  const initials = author
    ? author.split(" ").length > 1
      ? author
          .split(" ")
          .map((word) => word[0].toUpperCase())
          .slice(0, 2)
          .join("")
      : author.slice(0, 2).toUpperCase()
    : "UN";

  const handleReactionSelect = async (emoji: string) => {
    const alreadyReacted = localReactions.some(
      (reaction) => reaction.reaction === emoji && reaction.user.id === user?.id
    );

    try {
      if (alreadyReacted) {
        setLocalReactions((prev) =>
          prev.filter((r) => !(r.reaction === emoji && r.user.id === user?.id))
        );

        await deleteReaction({
          chatId,
          messageId: message.id,
          reaction: emoji,
        }).unwrap();
      } else {
        const optimisticReaction = {
          id: crypto.randomUUID(),
          reaction: emoji,
          user: user!,
          created_at: new Date().toISOString(),
        };

        setLocalReactions((prev) => [...prev, optimisticReaction]);

        await addReaction({
          chatId,
          messageId: message.id,
          reaction: emoji,
        }).unwrap();
      }

      setEmojiModalOpen(false);
    } catch {
      setLocalReactions(message.reactions ?? []);

      toast({
        title: "Failed to update reaction",
        variant: "destructive",
      });
    }
  };

  const hasTextSelection = () => {
    const selection = window.getSelection();
    return selection !== null && selection.toString().trim().length > 0;
  };

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const LONG_PRESS_DELAY = 500;

  const openEmojiPicker = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (hasTextSelection()) return;

    const rect = bubbleRef.current?.getBoundingClientRect();
    if (!rect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const pickerWidth = 350;
    const pickerHeight = 400;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.right;

    setPickerPosition({
      vertical:
        spaceBelow < pickerHeight && spaceAbove > spaceBelow ? "top" : "bottom",
      horizontal:
        spaceRight < pickerWidth && spaceLeft > spaceRight ? "right" : "left",
    });

    setEmojiModalOpen((prev) => !prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;

    longPressTimer.current = setTimeout(() => {
      openEmojiPicker(e);
    }, LONG_PRESS_DELAY);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    // Cancel long press if user starts scrolling
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className={cn("flex flex-col w-full", isOwn ? "" : "items-start")}>
      <div className={cn("flex", isOwn && "justify-end")}>
        {!isMobile && !isOwn && (
          <div className="relative mr-3">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-slate-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isOnlaine && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            )}
          </div>
        )}
        <div
          className={cn(
            "flex flex-col-reverse md:flex-col md:gap-1.5 min-w-0 py-2 lg:max-w-[70%]",
            isOwn && isMobile ? "items-end" : undefined
          )}
        >
          <div className="flex justify-between font-semibold text-[#1D1D1F] text-[12px] md:text-[14px]">
            {!isMobile && (
              <span className="text-nowrap">{isOwn ? "You" : author}</span>
            )}
            <span className="ml-4 text-muted-foreground whitespace-nowrap">
              {instant.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div
            ref={bubbleRef}
            className="relative w-fit"
            onClick={openEmojiPicker}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {isFileMessage ? renderFileMessage() : renderTextMessage()}

            {localReactions && localReactions.length > 0 && (
              <div
                className={cn(
                  "absolute -bottom-2 flex gap-1",
                  isOwn ? "-left-4" : "-right-4"
                )}
              >
                {localReactions.map((emoji, index) => (
                  <span
                    key={`${emoji}-${index}`}
                    className="text-sm flex bg-white border border-gray-300 rounded-full p-1 w-[30px] h-[30px] justify-center items-center shadow"
                  >
                    {emoji.reaction}
                  </span>
                ))}
              </div>
            )}

            {emojiModalOpen && (
              <div
                className={cn(
                  "absolute z-50 h-[200px]",
                  pickerPosition.vertical === "bottom"
                    ? "top-full mt-1"
                    : "bottom-full mb-1",
                  pickerPosition.horizontal === "left" ? "left-0" : "right-0"
                )}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: { native: string }) => {
                    handleReactionSelect(emoji.native);
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
      </div>
    </div>
  );
};
