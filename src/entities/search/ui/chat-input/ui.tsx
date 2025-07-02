import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";

interface SearchAiChatInputProps {
  placeholder?: string;
  onFileAttach?: (files: File[]) => void;
  className?: string;
  chatId?: string;
  onSend?: (message: string, files: File[], searchType: string) => void;
  disabled?: boolean;
}

export const SearchAiChatInput: React.FC<SearchAiChatInputProps> = ({
  placeholder = "Your message",
  onFileAttach,
  className = "",
  chatId = "",
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState<string>("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;

    onSend?.(message, attachedFiles, "Search");
    setMessage("");
    setAttachedFiles([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(files);
    onFileAttach?.(files);
  };

  const isFormValid = message.trim() !== "";

  return (
    <div
      className={cn(
        "flex flex-col w-full px-3 py-4 mt-auto gap-4 bg-white",
        className
      )}
    >
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          containerClassName="border-none bg-transparent focus-within:border-blue-500 p-0"
          className="p-0 border-none resize-none h-14 focus:border-blue-500"
        />

        <div className="flex flex-row items-center w-full gap-4">
          <label className="relative flex items-center text-gray-600 transition-colors cursor-pointer gap-2text-sm hover:text-gray-800 hover:bg-gray-100">
            <Paperclip size={24} />
            {attachedFiles.length > 0 && (
              <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -left-1">
                {attachedFiles.length.toString().length > 2
                  ? "99+"
                  : attachedFiles.length.toString()}
              </span>
            )}
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
          </label>
          <HealthProfileForm />
          <Button
            onClick={handleSend}
            disabled={!isFormValid}
            className="w-10 h-10 p-0 ml-auto bg-blue-500 rounded-full bottom-3 right-3 hover:bg-blue-600 disabled:opacity-50"
            title={
              isFormValid
                ? "Send message (Ctrl+Enter)"
                : "Please enter a message"
            }
          >
            <Send
              size={24}
              color="white"
              className="relative rotate-45 -left-[2px]"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
