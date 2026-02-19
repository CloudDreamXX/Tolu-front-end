import {
  ChatMessageModel,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} from "entities/chat";
import React, { useEffect, useRef, useState } from "react";
import { cn, toast, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";
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
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";

interface MessageBubbleProps {
  message: ChatMessageModel;
  chatId: string;
  avatar?: string;
  author?: string;
  isOnline?: boolean;
  isOwn?: boolean;
  className?: string;
  onDeleted?: (messageId: string) => void;
  onEdited?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  chatId,
  avatar,
  author,
  isOnline = false,
  isOwn = false,
  className = "",
  onDeleted,
  onEdited,
}) => {
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);
  const [localReactions, setLocalReactions] = useState(message.reactions ?? []);

  useEffect(() => {
    setLocalReactions(message.reactions ?? []);
  }, [message.reactions]);

  const user = useSelector((state: RootState) => state.user.user);

  const [addReaction] = useAddMessageReactionMutation();
  const [deleteReaction] = useDeleteMessageReactionMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

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

  useEffect(() => {
    setEditedContent(message.content);
  }, [message.content]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-message-menu]")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const renderFileMessage = () => (
    <div
      className={cn(
        "rounded-lg  p-2 text-base text-[#1D1D1F] flex flex-wrap gap-2 w-fit",
        "bg-[rgba(255,255,255,0.4)] border border-[#ECEFF4]",
        isOwn ? "rounded-tr-none" : "rounded-tl-none",
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

  const renderTextMessage = () => {
    if (isEditing) {
      return (
        <>
          <textarea
            autoFocus
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
              }
              if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
            className={cn(
              "w-full rounded-lg px-[14px] py-[10px] text-base resize-none",
              "border border-[#008FF6] focus:outline-none bg-white",
              className
            )}
          />
          <div className="flex items-center justify-end gap-[4px]">
            <Button
              variant={"light-blue"}
              className=" h-7"
              size={"sm"}
              onClick={() => handleCancelEdit()}
            >
              Cancel
            </Button>
            <Button
              variant={"brightblue"}
              className="h-7"
              size={"sm"}
              onClick={() => handleSaveEdit()}
            >
              Save
            </Button>
          </div>
        </>
      );
    }

    return (
      <div
        className={cn(
          "inline-block rounded-lg px-[14px] py-[10px] text-base text-[#1D1D1F]",
          "max-w-full overflow-hidden break-words whitespace-pre-wrap",
          "bg-[rgba(255,255,255,0.4)] border border-[#ECEFF4]",
          isOwn ? "rounded-tr-none" : "rounded-tl-none",
          className
        )}
      >
        {message.content}
      </div>
    );
  };

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
    const spaceWhenAlignedLeft = viewportWidth - rect.left;
    const spaceWhenAlignedRight = rect.right;

    const preferredHorizontal = isOwn ? "right" : "left";
    const canUsePreferred =
      preferredHorizontal === "right"
        ? spaceWhenAlignedRight >= pickerWidth
        : spaceWhenAlignedLeft >= pickerWidth;

    const fallbackHorizontal =
      spaceWhenAlignedRight > spaceWhenAlignedLeft ? "right" : "left";

    setPickerPosition({
      vertical:
        spaceBelow < pickerHeight && spaceAbove > spaceBelow ? "top" : "bottom",
      horizontal: canUsePreferred ? preferredHorizontal : fallbackHorizontal,
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

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || editedContent === message.content) {
      setIsEditing(false);
      return;
    }

    try {
      await updateMessage({
        chatId,
        messageId: message.id,
        content: editedContent,
      }).unwrap();

      toast({ title: "Message updated" });
      setIsEditing(false);

      onEdited?.();
    } catch {
      toast({
        title: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleTouchMove = () => {
    // Cancel long press if user starts scrolling
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage({
        chatId,
        messageId: id,
      }).unwrap();
      setConfirmDelete(false);

      toast({
        title: "Message deleted successfully",
      });

      onDeleted?.(message.id);
    } catch {
      toast({
        title: "Failed to delete message",
        variant: "destructive",
      });
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
            {isOnline && (
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
            onClick={isEditing ? undefined : openEmojiPicker}
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

            {isOwn && (
              <div className="absolute -top-2 -right-4" data-message-menu>
                {!isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((prev) => !prev);
                    }}
                    className="rounded-full bg-white border shadow
        w-6 h-6 flex items-center justify-center
        hover:bg-[#ECEFF4]"
                    title="Message actions"
                  >
                    <MaterialIcon iconName="more_vert" size={20} />
                  </button>
                )}

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-1 bg-white rounded-[10px]
          shadow-[0px_8px_18px_rgba(0,0,0,0.15)]
          z-50 w-[160px] gap-[6px] bg-white w-fit flex flex-col items-start rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        setIsEditing(true);
                      }}
                      className="w-full px-[14px] py-[10px] flex items-center gap-[8px]"
                    >
                      <MaterialIcon iconName="edit" />
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        setConfirmDelete(true);
                      }}
                      className="w-full px-[14px] py-[10px]
            flex items-center gap-[8px]
            text-[#FF1F0F]"
                    >
                      <MaterialIcon
                        iconName="delete"
                        className="text-[#FF1F0F]"
                      />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {confirmDelete && (
              <DeleteMessagePopup
                contentId={message.id}
                onCancel={() => setConfirmDelete(false)}
                onDelete={handleDeleteMessage}
                title="Delete message?"
                text="This action cannot be undone."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
