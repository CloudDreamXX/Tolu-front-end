import { RootState } from "entities/store";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { cn } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { PopoverClient } from "widgets/content-popovers/ui/popover-client";
import { DailyJournal } from "widgets/dayli-journal";
import { SwitchGroup } from "widgets/switch-group";

interface LibraryChatInputProps {
  switchOptions: string[];
  selectedSwitch: string;
  setSelectedSwitch: (option: string) => void;
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
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  placeholder = "Your message",
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
}) => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.client.loading);
  const location = useLocation();
  const isContentManager = location.pathname.includes("content-manager");

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || disabled) return;
    onSend?.(message, attachedFiles, null);
    setAttachedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(files);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSendDisabled =
    (!message.trim() && attachedFiles.length === 0) || disabled;

  return (
    <div
      className={cn(
        "p-4 bg-white border-t border-gray-200 rounded-[8px]",
        className
      )}
    >
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
      <div className="relative mb-4">
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => {
            if (setNewMessage) {
              setNewMessage(e.target.value);
            }
          }}
          onKeyDown={handleKeyPress}
          className="w-full h-[80px] text-sm md:text-sm xl:text-sm resize-none"
          containerClassName="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {footer ?? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="relative flex items-center text-gray-600 transition-colors rounded-lg cursor-pointer hover:text-gray-800">
              <Button
                variant="ghost"
                className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
              >
                <Paperclip size={24} />
              </Button>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute w-[50px] z-[9999] cursor-pointer opacity-0"
                disabled={false}
              />
              {attachedFiles.length > 0 && (
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -left-1">
                  {attachedFiles.length > 99 ? "99+" : attachedFiles.length}
                </span>
              )}
            </label>
            {isContentManager ? (
              <div className="flex items-center gap-[10px]">
                <PopoverClient setClientId={setClientId} />
              </div>
            ) : (
              <Button
                variant={"brightblue"}
                onClick={() => setModalOpen(true)}
                className="hidden md:block"
              >
                Daily Journal
              </Button>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={isSendDisabled}
            className="w-10 h-10 p-0 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Send size={20} color="white" />
          </Button>
        </div>
      )}

      <div className="md:hidden block mt-[16px]">
        <SwitchGroup
          options={switchOptions}
          activeOption={selectedSwitch}
          onChange={setSelectedSwitch}
          classname="mb-4"
        />
      </div>

      <div className="hidden mt-4 md:block">
        <DailyJournal
          isOpen={modalOpen}
          onCancel={() => setModalOpen(false)}
          onDone={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};
