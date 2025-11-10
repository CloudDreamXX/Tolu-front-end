import {
  setFolderToChat,
  setIsMobileDailyJournalOpen,
} from "entities/client/lib";
import { RootState } from "entities/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import {
  PopoverAttach,
  PopoverFolder,
  PopoverInstruction,
} from "widgets/content-popovers";
import { PopoverClient } from "widgets/content-popovers/ui/popover-client";
import { VoiceRecorderButton } from "widgets/content-popovers/ui/popover-voice";
import { DailyJournal } from "widgets/dayli-journal";
import { ReferAFriendPopup } from "widgets/ReferAFriendPopup/ui";

interface LibraryChatInputProps {
  selectedSwitch: string;
  files: File[];
  setFiles: (files: File[]) => void;
  voiceFile?: File | null;
  setVoiceFile?: (file: File | null) => void;
  placeholder?: string;
  onSend?: (
    message: string,
    files: File[],
    selectedOption: string | null
  ) => void;
  disabled?: boolean;
  className?: string;
  footer?: React.ReactNode;
  textarea?: React.ReactNode;
  setNewMessage?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  message: string;
  setClientId?: (clientId: string | null) => void;
  selectedText?: string;
  deleteSelectedText?: () => void;
  existingFiles?: string[];
  existingInstruction?: string;
  setExistingFiles?: React.Dispatch<React.SetStateAction<string[]>>;
  setExistingInstruction?: React.Dispatch<React.SetStateAction<string>>;
  setInstruction?: React.Dispatch<React.SetStateAction<string>>;
  instruction?: string;
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  placeholder = "Your message",
  files,
  setFiles,
  voiceFile,
  setVoiceFile,
  onSend,
  disabled = false,
  className,
  selectedSwitch,
  setNewMessage,
  footer,
  textarea,
  message,
  setClientId,
  selectedText,
  deleteSelectedText,
  setExistingInstruction,
  setExistingFiles,
  existingInstruction,
  instruction,
  setInstruction,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [referAFriendOpen, setReferAFriendOpen] = useState<boolean>(false);
  const location = useLocation();
  const isContentManager =
    location.pathname.includes("content-manager") ||
    location.pathname.includes("clients");
  const dispatch = useDispatch();
  const folderState = useSelector(
    (state: RootState) => state.client.selectedChatFolder || null
  );
  const filesFromLibrary = useSelector(
    (state: RootState) => state.client.selectedFilesFromLibrary || []
  );

  const handleSend = () => {
    if ((!voiceFile && !message.trim() && files.length === 0) || disabled)
      return;
    onSend?.(message, files, null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      if (deleteSelectedText) deleteSelectedText();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pasted: File[] = [];
    Array.from(items).forEach((it) => {
      if (it.kind === "file") {
        const f = it.getAsFile();
        if (f) {
          pasted.push(f);
        }
      }
    });

    setFiles([...files, ...pasted]);
  };

  const isSendDisabled = voiceFile ? false : !message.trim() || disabled;

  const handleSetFolder = (folder: string | null) => {
    dispatch(setFolderToChat(folder));
  };

  const attachKey = files
    .map((f) => `${f.name}-${f.size}-${f.lastModified}`)
    .join("|");

  return (
    <div
      className={cn(
        "p-4 bg-white border-t border-gray-200 rounded-[8px]",
        className
      )}
    >
      {selectedText && (
        <div className="flex gap-[16px] justify-between items-baseline mb-[8px] text-[14px]">
          <div className="flex gap-[8px] items-baseline">
            <div>
              <MaterialIcon iconName="subdirectory_arrow_right" />
            </div>
            <div className="truncate-text">{selectedText}</div>
          </div>
          <button
            className="w-[20px] h-[20px] flex items-center justify-center"
            onClick={deleteSelectedText}
          >
            <MaterialIcon iconName="close" size={20} />
          </button>
        </div>
      )}
      {textarea ?? (
        <div
          className={`relative mb-4 flex gap-[32px] md:block h-[60px] md:h-fit`}
        >
          <Textarea
            placeholder={placeholder}
            value={message}
            onPaste={handlePaste}
            onChange={(e) => {
              if (setNewMessage) {
                setNewMessage(e.target.value);
              }
            }}
            onKeyDown={handleKeyPress}
            className="w-full text-base sm:text-base md:text-base xl:text-base resize-none focus:outline-none focus:ring-0 focus:border-transparent"
            containerClassName={`border-0 md:border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-0 focus:border-transparent text-base sm:text-base md:text-base lg:text-base`}
            style={{
              WebkitTextSizeAdjust: "100%",
              textSizeAdjust: "100%",
            }}
          />
          <Button
            onClick={() => handleSend()}
            disabled={isSendDisabled}
            className="md:hidden w-[32px] h-[32px] p-[8px] bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-[#D5DAE2] disabled:cursor-not-allowed"
          >
            <MaterialIcon iconName="arrow_upward" />
          </Button>
        </div>
      )}
      {footer ?? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PopoverAttach
              key={attachKey}
              files={files}
              setFiles={setFiles}
              hideFromLibrary
              fileExtensions={[".pdf", ".png", ".jpg", ".jpeg", ".gif"]}
              title="Attach files"
              description="Add credible references to support information integrity"
              customTrigger={
                <Button
                  variant="ghost"
                  className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                >
                  <MaterialIcon iconName="attach_file" />
                  {(files.length > 0 || filesFromLibrary.length > 0) && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                      {files.length + filesFromLibrary.length}
                    </span>
                  )}
                </Button>
              }
            />
            {isContentManager ? (
              selectedSwitch === "Research" ? (
                <div className="flex items-center gap-[10px]">
                  <PopoverClient setClientId={setClientId} />
                </div>
              ) : (
                <div className="flex items-center gap-[10px]">
                  <PopoverClient setClientId={setClientId} />
                  <PopoverFolder
                    folderId={folderState || undefined}
                    setFolderId={handleSetFolder}
                    setExistingFiles={setExistingFiles}
                    setExistingInstruction={setExistingInstruction}
                  />
                  <PopoverInstruction
                    customTrigger={
                      <Button
                        variant="ghost"
                        className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                        disabled={!folderState}
                      >
                        <MaterialIcon iconName="settings" size={24} />
                        {((instruction && instruction?.length > 0) ||
                          (existingInstruction &&
                            existingInstruction?.length > 0)) && (
                          <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                            1
                          </span>
                        )}
                      </Button>
                    }
                    folderInstruction={existingInstruction}
                    setInstruction={setInstruction}
                  />
                </div>
              )
            ) : (
              <div className="flex gap-[8px] items-center">
                {selectedSwitch === "Smart Search" && (
                  <div className="mr-[8px] relative">
                    <VoiceRecorderButton
                      setVoiceFile={(file) => setVoiceFile?.(file)}
                    />
                  </div>
                )}
                {!voiceFile && (
                  <Button
                    variant={"brightblue"}
                    onClick={() => {
                      dispatch(setIsMobileDailyJournalOpen(true));
                      setModalOpen(true);
                    }}
                  >
                    Daily Journal
                  </Button>
                )}
                {!voiceFile && (
                  <Button
                    variant={"light-blue"}
                    onClick={() => {
                      setReferAFriendOpen(true);
                    }}
                    className="hidden md:block"
                  >
                    Refer a friend
                  </Button>
                )}
              </div>
            )}
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={isSendDisabled}
            variant="brightblue"
            className={`w-10 h-10 p-0 bg-blue-600 rounded-full disabled:bg-blue-300 disabled:cursor-not-allowed hidden md:flex xl:hidden`}
          >
            <MaterialIcon iconName="send" />
          </Button>
        </div>
      )}

      {!isContentManager && (
        <div className="hidden mt-4 md:block">
          <DailyJournal
            isOpen={modalOpen}
            onCancel={() => setModalOpen(false)}
            onClose={() => setModalOpen(false)}
          />
        </div>
      )}
      {!isContentManager && (
        <div className="hidden mt-4 md:block">
          <ReferAFriendPopup
            isOpen={referAFriendOpen}
            onClose={() => setReferAFriendOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
