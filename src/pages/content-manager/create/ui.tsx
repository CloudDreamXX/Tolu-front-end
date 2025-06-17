import { Send } from "lucide-react";
import { Textarea, Button } from "shared/ui";
import {
  PopoverClient,
  PopoverFolder,
  PopoverAttach,
  PopoverInstruction,
} from "widgets/content-popovers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ContentManagerCreatePage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [instruction, setInstruction] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const nav = useNavigate();
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>("");

  const handleSendMessage = async () => {
    if (message.trim() === "" || !folderId) return;

    setIsSending(true);

    const tempDocumentId = `temp_${Date.now()}`;

    nav(
      `/content-manager/library/folder/${folderId}/document/${tempDocumentId}`,
      {
        state: {
          isNewDocument: true,
          chatMessage: {
            user_prompt: message,
            is_new: true,
            regenerate_id: null,
            chat_title: title,
          },
          folderId,
          files,
          instruction,
          clientId,
          originalMessage: message,
          originalTitle: title,
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-[48px] md:gap-[24px] px-[16px] py-[24px] md:px-[24px] md:py-[48px] xl:px-[48px] xl:py-[150px] mt-auto md:mb-auto xl:mt-0">
      <h1 className="text-[24px] md:text-[40px] xl:text-[36px] font-semibold text-center">
        Hi, how can I help you?
      </h1>
      <div className="flex flex-col-reverse md:flex-col gap-[8px] md:gap-[16px] xl:gap-[24px]">
        <Textarea
          isTitleVisible={true}
          titleValue={title}
          onTitleChange={(e) => setTitle(e.target.value)}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Let's start with a subject or writing request..."
          containerClassName="border-[#008FF6]"
          className="h-20 text-lg font-medium resize-none placeholder:text-[#1D1D1F80] text-[#1D1D1F]"
          footer={
            <div className="flex flex-row w-full gap-[10px]">
              <PopoverClient setClientId={setClientId} />
              <PopoverFolder
                setFolderId={setFolderId}
                setExistingFiles={setExistingFiles}
                setExistingInstruction={setExistingInstruction}
              />
              <Button
                variant="black"
                className="ml-auto w-12 h-12 p-[10px] rounded-full"
                onClick={handleSendMessage}
                disabled={isSending || !folderId || !message.trim()}
              >
                <Send color="#fff" />
              </Button>
            </div>
          }
          footerClassName="rounded-b-[18px] border-[#008FF6] border-t-0"
        />
        <div className="flex flex-col md:flex-row gap-[8px] md:gap-[16px] xl:gap-[24px]">
          <PopoverAttach
            setFiles={setFiles}
            existingFiles={existingFiles}
            disabled={!folderId}
          />
          <PopoverInstruction
            setInstruction={setInstruction}
            disabled={!folderId}
            existingInstruction={existingInstruction}
          />
        </div>
      </div>
    </div>
  );
};
