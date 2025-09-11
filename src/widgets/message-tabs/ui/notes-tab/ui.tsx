import { DetailsChatItemModel } from "entities/chat";
import {
  useDeleteChatNoteMutation,
  useGetAllChatNotesQuery,
  useSendChatNoteMutation,
  useUpdateChatNoteMutation,
} from "entities/chat/chatApi";
import { RootState } from "entities/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast, usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { NoteItem } from "widgets/notes-item/ui";
import { useFilePicker } from "../../../../shared/hooks/useFilePicker";
import { ChatScroller } from "../components/ChatScroller";

interface NotesTabProps {
  search?: string;
  chat: DetailsChatItemModel;
}

export const NotesTab: React.FC<NotesTabProps> = ({ chat, search }) => {
  const profile = useSelector((state: RootState) => state.user.user);
  const isToluAdmin = chat?.participants.some((p) => p.role === "admin");

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
    accept: ["application/pdf", "image/jpeg", "image/png"],
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const {
    data: notes,
    isLoading,
    refetch,
  } = useGetAllChatNotesQuery(
    { chatId: chat.chat_id },
    { skip: !chat.chat_id }
  );
  const [sendNote, { isLoading: isSending }] = useSendChatNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateChatNoteMutation();
  const [deleteNote] = useDeleteChatNoteMutation();

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      if (editingId) {
        await updateNote({
          noteId: editingId,
          payload: {
            noteData: { title: "test-title", content: input },
            file: items[0]?.file,
          },
        }).unwrap();
        setEditingId(null);
      } else {
        await sendNote({
          noteData: {
            title: "test-title",
            content: input,
            chat_id: chat.chat_id,
          },
          file: items[0]?.file,
        }).unwrap();
      }
      setInput("");
      clear();
      refetch();
    } catch {
      toast({ title: "Failed to save note", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote({ noteId: id, chatId: chat.chat_id }).unwrap();
      refetch();
    } catch {
      toast({ title: "Failed to delete note", variant: "destructive" });
    }
  };

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
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
      : `calc(100vh - ${396 + filesDivHeight}px)`,
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
    const arr = (notes?.notes ?? []).slice();
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return search
      ? arr.filter((n) =>
        (n.content || "").toLowerCase().includes(search.toLowerCase())
      )
      : arr;
  }, [notes?.notes, search]);

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
                onEdit={handleEdit}
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

      {!isToluAdmin && (
        <div className="pt-2">
          <Textarea
            placeholder={`Write note...`}
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
                            <MaterialIcon
                              iconName="delete"
                              className="w-5 h-5 "
                              fill={1}
                            />
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
      )}
    </>
  );
};
