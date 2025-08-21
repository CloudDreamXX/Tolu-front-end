import { useState } from "react";
import { CoachService } from "entities/coach";
import { IDocument } from "entities/document";

const isHtmlContent = (content: string): boolean => /<[^>]*>/.test(content);

export const useMessageState = () => {
  const [message, setMessage] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [newMessageStreaming, setNewMessageStreaming] = useState<string>("");
  const [newMessageIsHtml, setNewMessageIsHtml] = useState<boolean>(false);

  const handleSendMessage = async (
    document: IDocument,
    folderId: string,
    onConversationUpdate: () => Promise<void>
  ) => {
    if (!message.trim() || !document || !folderId) return;

    setIsSendingMessage(true);
    setNewMessageStreaming("");
    setNewMessageIsHtml(false);

    let accumulatedReply = "";

    try {
      await CoachService.aiLearningSearch(
        {
          user_prompt: message,
          is_new: false,
          chat_id: document.chatId ?? "",
          regenerate_id: null,
          chat_title: document?.aiTitle ?? "",
          instructions: document.originalInstructions ?? "",
        },
        folderId,
        files,
        undefined,
        clientId,
        undefined,
        (chunk) => {
          if (chunk.reply) {
            accumulatedReply += chunk.reply;
            setNewMessageStreaming(accumulatedReply);
            if (!newMessageIsHtml && isHtmlContent(accumulatedReply)) {
              setNewMessageIsHtml(true);
            }
          }
        },
        async () => {
          await onConversationUpdate();
          setMessage("");
          setIsSendingMessage(false);
          setNewMessageStreaming("");
          setNewMessageIsHtml(false);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSendingMessage(false);
    }
  };

  return {
    // State
    message,
    clientId,
    files,
    isSendingMessage,
    newMessageStreaming,
    newMessageIsHtml,

    // Actions
    setMessage,
    setClientId,
    setFiles,
    handleSendMessage,
  };
};
