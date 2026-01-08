import { AxiosProgressEvent } from "axios";
import { ChatItemModel, ServerChatItemModel } from ".";

export const toChatItem = (s: ServerChatItemModel): ChatItemModel => ({
  id: s.chat_id,
  name: s.name,
  avatar_url: s.avatar_url,
  type: s.chat_type,
  lastMessageAt: s.last_message_at,
  unreadCount: s.unread_count,
  lastMessage: s.last_message,
  participants: s.participants,
});

export function fileKeyFromUrl(input: string): string {
  if (!input) return "";

  try {
    const last = input.split("/").pop() || input;
    const clean = last.split("?")[0].split("#")[0];

    return clean
      .replace(/\.mp4$/i, "")
      .toLowerCase()
      .trim();
  } catch {
    return input
      .replace(/\.mp4$/i, "")
      .toLowerCase()
      .trim();
  }
}

export const onDownloadProgress = (
  e: AxiosProgressEvent,
  onProgress?: (pct: number) => void
) => {
  let pct: number | undefined;
  if (typeof e.progress === "number") {
    pct = Math.round(e.progress * 100);
  } else if (e.total) {
    pct = Math.round((e.loaded / e.total) * 100);
  } else {
    pct = undefined;
  }
  if (pct !== undefined && onProgress) onProgress(pct);
};
