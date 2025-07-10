import { Send } from "lucide-react";
import React from "react";
import Attach from "shared/assets/icons/attach";
import { Button, Textarea } from "shared/ui";
import { PopoverAttach, PopoverClient } from "widgets/content-popovers";

interface MessageInputProps {
  message: string;
  isSendingMessage: boolean;
  folderId?: string;
  documentId?: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => Promise<void>;
  setFiles: (files: File[]) => void;
  setClientId: (clientId: string | null) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  isSendingMessage,
  folderId,
  documentId,
  onMessageChange,
  onSendMessage,
  setFiles,
  setClientId,
}) => {
  return (
    <Textarea
      value={message}
      onChange={(e) => onMessageChange(e.target.value)}
      placeholder="Let's start with a subject or writing request..."
      disabled={isSendingMessage}
      containerClassName="w-full rounded-3xl overflow-hidden border border-[#008FF6] mt-auto mb-10"
      className="h-20 text-lg font-medium text-gray-900 resize-none placeholder:text-gray-500"
      footer={
        <div className="flex flex-col gap-[8px] w-full">
          <div className="flex flex-row w-full gap-[10px]">
            <PopoverAttach
              setFiles={setFiles}
              disabled={!folderId}
              customTrigger={
                <button className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[#F3F6FB]">
                  <Attach />
                </button>
              }
            />
            <PopoverClient setClientId={setClientId} documentId={documentId} />
            <div className="flex items-center gap-[32px] ml-auto">
              <div className="items-center hidden gap-2 md:flex">
                <button
                  type="button"
                  className="relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 border-[#B0B0B5] transition-colors duration-300 bg-[#B0B0B5]"
                >
                  <span className="inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md transform transition-transform duration-300" />
                </button>
                <span className="text-[#5F5F65] font-semibold text-[16px]">
                  Case-based generation
                </span>
              </div>
              <Button
                variant="black"
                className="ml-auto w-12 h-12 p-[10px] rounded-full"
                onClick={onSendMessage}
                disabled={isSendingMessage}
              >
                <Send color="#fff" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 border-[#B0B0B5] transition-colors duration-300 bg-[#B0B0B5]"
            >
              <span className="inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md transform transition-transform duration-300" />
            </button>
            <span className="text-[#5F5F65] font-semibold text-[16px]">
              Case-based generation
            </span>
          </div>
        </div>
      }
    />
  );
};
