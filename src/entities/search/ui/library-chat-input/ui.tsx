import { UserCircleGearIcon } from "@phosphor-icons/react";
import { Paperclip, Send, User } from "lucide-react";
import React, { useState } from "react";
import { cn } from "shared/lib";
import { Button, Input, Switch, Textarea } from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";

interface LibraryChatInputProps {
  placeholder?: string;
  onSend?: (message: string, files: File[], personalize: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  placeholder = "Your message",
  onSend,
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState("");
  const [personalize, setPersonalize] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || disabled) return;
    onSend?.(message, attachedFiles, personalize);
    setMessage("");
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
    <div className={cn("p-4 bg-white border-t border-gray-200", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Switch
          checked={personalize}
          onCheckedChange={setPersonalize}
          id="personalize-search"
        />
        <label
          htmlFor="personalize-search"
          className="text-sm text-gray-700 cursor-pointer"
        >
          Personalize search
        </label>
      </div>
      <div className="relative mb-4">
        <Input
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="relative flex items-center text-gray-600 transition-colors rounded-lg cursor-pointer hover:text-gray-800">
            <Paperclip size={24} />
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
        </div>
        <Button
          onClick={handleSend}
          disabled={isSendDisabled}
          className="w-10 h-10 p-0 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <Send size={20} color="white" />
        </Button>
      </div>
    </div>
  );
};
