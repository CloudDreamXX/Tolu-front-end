import { DetailsChatItemModel } from "entities/chat";
import {
  useDeleteChatNoteMutation,
  useGetAllChatNotesQuery,
  useSendChatNoteMutation,
  useUpdateChatNoteMutation,
} from "entities/chat/api";
import { upsertChat } from "entities/chat/chatsSlice";
import { RootState } from "entities/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast, usePageWidth } from "shared/lib";
import { Button, Input, Textarea } from "shared/ui";
import { NoteItem } from "widgets/notes-item/ui";
import { useFilePicker } from "../../../../shared/hooks/useFilePicker";
import { ChatScroller } from "../components/ChatScroller";

interface NotesTabProps {
  search?: string;
  chat: DetailsChatItemModel;
}

export const NotesTab: React.FC<NotesTabProps> = ({ chat, search }) => {
  const profile = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const { isMobile, isTablet, isMobileOrTablet } = usePageWidth();
  const {
    files,
    items,
    remove,
    getInputProps,
    getDropzoneProps,
    dragOver,
    open,
    clear,
  } = useFilePicker({
    accept: ["application/pdf", "image/jpeg", "image/png", "video/mp4"],
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [createdChatId, setCreatedChatId] = useState<string | null>(null);

  const isNewChat = chat.chat_type === "new_chat";
  const actualChatId = createdChatId || chat.chat_id;

  const {
    data: notes,
    isLoading,
    refetch,
  } = useGetAllChatNotesQuery(actualChatId, {
    skip: !actualChatId || (isNewChat && !createdChatId),
    refetchOnMountOrArgChange: true,
  });

  const [sendNote, { isLoading: isSending }] = useSendChatNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateChatNoteMutation();
  const [deleteNote] = useDeleteChatNoteMutation();

  const handleSend = async () => {
    if (!title.trim() || !input.trim()) return;

    try {
      if (editingId) {
        await updateNote({
          noteId: editingId,
          payload: {
            title,
            content: input,
            remove_file: items.length === 0,
            file: items[0]?.file,
          },
        }).unwrap();
        setEditingId(null);
      } else {
        // Send note with chat_id for existing chats or target_user_id for new chats
        const notePayload: any = {
          title,
          content: input,
        };

        if (isNewChat && !createdChatId) {
          const participant = chat.participants[0];
          const targetUserId = participant?.user?.user_id;
          if (targetUserId) {
            notePayload.target_user_id = targetUserId;
          } else {
            console.error('No target_user_id found! Participant:', participant);
          }
        } else {
          if (actualChatId) {
            notePayload.chat_id = actualChatId;
          } else {
            console.error('No chat_id found!');
          }
        }

        if (items[0]?.file) {
          notePayload.file = items[0].file;
        }

        const noteResponse = await sendNote(notePayload).unwrap();

        if (isNewChat && !createdChatId) {
          const chatIdFromNote = noteResponse.data.chat_id;
          setCreatedChatId(chatIdFromNote);

          const participant = chat.participants[0];
          const chatName = participant.user.first_name && participant.user.last_name
            ? `${participant.user.first_name} ${participant.user.last_name}`
            : participant.user.name;

          dispatch(upsertChat({
            id: chatIdFromNote,
            type: "direct",
            lastMessageAt: noteResponse.data.created_at,
            unreadCount: 0,
            lastMessage: null,
            name: chatName,
            avatar_url: "",
            participants: chat.participants.map(p => ({
              user_id: p.user.user_id,
              email: p.user.email,
              name: p.user.name,
              first_name: p.user.first_name,
              last_name: p.user.last_name,
            })),
          }));
        }
      }

      setInput("");
      setTitle("");
      clear();
      refetch();
    } catch (error) {
      toast({ title: "Failed to save note", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id).unwrap();
      setTitle("");
      setInput("");
      setEditingId(null);
      refetch();
    } catch {
      toast({ title: "Failed to delete note", variant: "destructive" });
    }
  };

  const handleEdit = (id: string, title: string, content: string) => {
    setEditingId(id);
    setTitle(title);
    setInput(content);
  };

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
      : `calc(100vh - ${465 + filesDivHeight}px)`,
  };

  let currentStyle = containerStyleLg;
  if (isMobile) {
    currentStyle = containerStyle;
  } else if (isTablet) {
    currentStyle = containerStyleMd;
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();
      handleSend();
    }
  };

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);

  const dataForList = useMemo(() => {
    const arr = (notes?.data ?? []).slice();
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return search
      ? arr.filter((n) =>
        (n.content || "").toLowerCase().includes(search.toLowerCase())
      )
      : arr;
  }, [notes?.data, search]);

  const prevLenRef = useRef(0);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const api = virtuosoRef.current;
    if (!api || dataForList.length === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        api.scrollToIndex({
          index: dataForList.length - 1,
          align: "end",
          behavior: behavior as "auto" | "smooth" | undefined,
        });
        setTimeout(
          () =>
            api.scrollTo({
              top: 1e9,
              behavior: behavior as "auto" | "smooth" | undefined,
            }),
          0
        );
      });
    });
  };

  useEffect(() => {
    const prev = prevLenRef.current;
    const curr = dataForList.length;

    if (prev === 0) {
      scrollToBottom("auto");
    } else if (curr > prev && atBottom) {
      scrollToBottom("smooth");
    }

    prevLenRef.current = curr;
  }, [dataForList.length, atBottom]);

  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-full text-center">
      <p className="text-[18px] md:text-[20px] font-[500] text-[#1D1D1F]">
        There are no shared notes
      </p>
    </div>
  );

  return (
    <>
      <div style={currentStyle} className="relative w-full pr-3">
        {dataForList.length === 0 && !isLoading ? (
          renderEmptyState()
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: "100%" }}
            data={dataForList}
            itemContent={(_index, note) => (
              <NoteItem
                note={note}
                onEdit={(id, title, content) => handleEdit(id, title, content)}
                onDelete={handleDelete}
              />
            )}
            alignToBottom
            followOutput="smooth"
            atBottomStateChange={setAtBottom}
            increaseViewportBy={{ top: 200, bottom: 400 }}
            components={{
              Scroller: ChatScroller,
              Footer: () =>
                isLoading && (
                  <div className="flex justify-center py-2">
                    <MaterialIcon
                      iconName="progress_activity"
                      className="animate-spin"
                    />
                  </div>
                ),
            }}
          />
        )}
      </div>

      <div className="pt-2">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 md:text-[18px] rounded-[18px]"
        />

        <Textarea
          placeholder="Write note..."
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
                <div className="mt-1">
                  <p className="text-sm font-medium text-[#1D1D1F]">
                    Attached Files:
                  </p>
                  <div className="flex max-w-[800px] gap-4 mt-2 overflow-x-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.isVideo && item.previewUrl && (
                          <video
                            src={item.previewUrl}
                            className="w-[80px] h-[50px] rounded object-cover"
                            controls
                          />
                        )}

                        {item.isImage && item.previewUrl && (
                          <img
                            src={item.previewUrl}
                            className="w-[50px] h-[50px] rounded object-cover"
                          />
                        )}

                        <div className="flex flex-col items-start">
                          <span className="text-sm text-[#4B5563] truncate max-w-20">
                            {item.file.name}
                          </span>
                          <span className="text-xs text-[#6B7280]">
                            {(item.file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>

                        <Button
                          variant="unstyled"
                          size="unstyled"
                          onClick={() => remove(item.id)}
                          className="text-red-500"
                        >
                          <MaterialIcon iconName="delete" fill={1} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <Input {...getInputProps()} className="hidden" />
                  <Button value={"ghost"} className="p-0" onClick={open}>
                    <MaterialIcon iconName="add" className="text-[#1D1D1F]" />
                  </Button>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={isSending || isUpdating}
                  variant={isMobileOrTablet ? "brightblue" : "blue"}
                  className="rounded-full flex justify-center items-center
                      lg:w-[128px]"
                >
                  {isSending || isUpdating ? (
                    <MaterialIcon
                      iconName="progress_activity"
                      className="animate-spin"
                    />
                  ) : (
                    <>
                      <MaterialIcon iconName="send" />
                      {editingId ? "Update" : "Add"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};
