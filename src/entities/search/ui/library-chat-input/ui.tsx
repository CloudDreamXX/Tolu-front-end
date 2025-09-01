import { setIsMobileDailyJournalOpen } from "entities/client/lib";
import { RootState } from "entities/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { PopoverClient } from "widgets/content-popovers/ui/popover-client";
import { DailyJournal } from "widgets/dayli-journal";
import { ReferAFriendPopup } from "widgets/ReferAFriendPopup/ui";
import { SwitchGroup } from "widgets/switch-group";

interface LibraryChatInputProps {
  switchOptions: string[];
  selectedSwitch: string;
  files: File[];
  setSelectedSwitch: (option: string) => void;
  setFiles: (files: File[]) => void;
  placeholder?: string;
  onSend?: (
    message: string,
    files: File[],
    selectedOption: string | null
  ) => void;
  disabled?: boolean;
  className?: string;
  footer?: React.ReactNode;
  setNewMessage?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  message: string;
  setClientId?: (clientId: string | null) => void;
  selectedText?: string;
  deleteSelectedText?: () => void;
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  placeholder = "Your message",
  files,
  setFiles,
  onSend,
  disabled = false,
  className,
  switchOptions,
  selectedSwitch,
  setSelectedSwitch,
  setNewMessage,
  footer,
  isLoading,
  message,
  setClientId,
  selectedText,
  deleteSelectedText,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [referAFriendOpen, setReferAFriendOpen] = useState<boolean>(false);
  const loading = useSelector((state: RootState) => state.client.loading);
  const location = useLocation();
  const isContentManager = location.pathname.includes("content-manager");
  const dispatch = useDispatch();

  const handleSend = () => {
    if ((!message.trim() && files.length === 0) || disabled) return;
    onSend?.(message, files, null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(newFiles);
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

  const isSendDisabled = !message.trim() || disabled;

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
      {loading || isLoading ? (
        <div className="flex items-center gap-[16px] mb-[27px]">
          <div className="h-[22px] skeleton-gradient w-[110px] rounded-[24px]" />
          <div className="h-[22px] skeleton-gradient w-[110px] rounded-[24px]" />
          <div className="h-[22px] skeleton-gradient w-[110px] rounded-[24px]" />
        </div>
      ) : (
        <div className="hidden md:block">
          <SwitchGroup
            options={switchOptions}
            activeOption={selectedSwitch}
            onChange={setSelectedSwitch}
            classname="mb-4"
          />
        </div>
      )}
      <div className={`relative mb-4 flex gap-[32px] md:block`}>
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
          className="w-full h-[80px] text-base sm:text-base md:text-base xl:text-base resize-none focus:outline-none focus:ring-0 focus:border-transparent"
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
      {footer ?? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label
              className={`relative items-center text-gray-600 transition-colors rounded-lg cursor-pointer hover:text-gray-800 hidden md:flex`}
            >
              <Button
                variant="ghost"
                className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
              >
                <MaterialIcon iconName="attach_file" />
              </Button>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute w-[50px] z-[9999] cursor-pointer opacity-0"
                disabled={false}
              />
              {files.length > 0 && (
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -left-1">
                  {files.length > 99 ? "99+" : files.length}
                </span>
              )}
            </label>
            {isContentManager ? (
              <div className="flex items-center gap-[10px]">
                <PopoverClient setClientId={setClientId} />
              </div>
            ) : (
              <div className="flex gap-[8px] items-center">
                <Button
                  variant={"brightblue"}
                  onClick={() => {
                    dispatch(setIsMobileDailyJournalOpen(true));
                    setModalOpen(true);
                  }}
                >
                  Daily Journal
                </Button>
                <Button
                  variant={"light-blue"}
                  onClick={() => {
                    setReferAFriendOpen(true);
                  }}
                  className="hidden md:block"
                >
                  Refer a friend
                </Button>
              </div>
            )}
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={isSendDisabled}
            variant="brightblue"
            className={`w-10 h-10 p-0 bg-blue-600 rounded-full disabled:bg-blue-300 disabled:cursor-not-allowed hidden md:flex`}
          >
            <MaterialIcon iconName="send" />
          </Button>
        </div>
      )}

      <div className="md:hidden flex justify-between mt-[16px]">
        <SwitchGroup
          options={switchOptions}
          activeOption={selectedSwitch}
          onChange={setSelectedSwitch}
          classname="mb-4"
        />
        <label className="relative flex items-center text-gray-600 transition-colors rounded-lg cursor-pointer hover:text-gray-800 w-[24px] h-[24px]">
          <Button
            variant="default"
            className="relative text-[#1D1D1F] rounded-full w-[24px] h-[24px]"
          >
            <MaterialIcon iconName="add" />
          </Button>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="absolute w-[24px] h-[24px] z-[9999] cursor-pointer opacity-0"
            disabled={false}
          />
          {files.length > 0 && (
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-2 -left-2 z-[9999]">
              {files.length > 99 ? "99+" : files.length}
            </span>
          )}
        </label>
      </div>

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
