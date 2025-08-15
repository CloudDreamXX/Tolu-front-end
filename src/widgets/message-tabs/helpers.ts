import { ChatService } from "entities/chat";

export const getAvatarUrl = async (fileUrl: string | null) => {
  if (!fileUrl) return "";

  const response = await ChatService.getUploadedChatAvatar(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);
  const blob = new Blob([byteArray]);

  return URL.createObjectURL(blob);
};
