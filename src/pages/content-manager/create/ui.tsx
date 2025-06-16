import { Send } from "lucide-react";
import { Textarea, Button } from "shared/ui";
import {
  PopoverClient,
  PopoverFolder,
  PopoverAttach,
  PopoverInstruction,
} from "widgets/content-popovers";
import { useState } from "react";
import { AIChatMessage, CoachService } from "entities/coach";
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
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsSending(true);

    const chatMessage: AIChatMessage = {
      user_prompt: message,
      is_new: true,
      regenerate_id: null,
      chat_title: title,
    };

    let finalAccumulatedReply = "";
    let contentId = "";

    try {
      setIsStreaming(true);
      await CoachService.aiLearningSearch(
        chatMessage,
        folderId,
        instruction,
        files,
        clientId,
        (chunk) => {
          contentId = chunk.saved_content_id;
          if (chunk.reply) {
            finalAccumulatedReply += chunk.reply;
            console.log("Streaming chunk:", chunk.reply);
          }
        },
        ({ folderId: completedFolderId, documentId, chatId }) => {
          setIsStreaming(false);
          console.log("Final accumulated reply:", finalAccumulatedReply);

          nav(
            `/content-manager/library/folder/${folderId}/document/${documentId}`,
            {
              state: {
                accumulatedReply: finalAccumulatedReply,
                contentId: contentId,
                chatId: chatId,
              },
            }
          );
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="mb-4 text-lg font-semibold">Streaming in progress...</h2>
      </div>
    );
  }

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
              <PopoverFolder setFolderId={setFolderId} />
              <Button
                variant="black"
                className="ml-auto w-12 h-12 p-[10px] rounded-full"
                onClick={handleSendMessage}
                disabled={isSending}
              >
                <Send color="#fff" />
              </Button>
            </div>
          }
          footerClassName="rounded-b-[18px] border-[#008FF6] border-t-0"
        />
        <div className="flex flex-col md:flex-row gap-[8px] md:gap-[16px] xl:gap-[24px]">
          <PopoverAttach setFiles={setFiles} />
          <PopoverInstruction setInstruction={setInstruction} />
        </div>
      </div>
    </div>
  );
};
