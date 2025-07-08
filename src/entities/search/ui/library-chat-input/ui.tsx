import { HealthHistory } from "entities/health-history";
import { Paperclip, Send } from "lucide-react";
import React, { useState } from "react";
import { cn } from "shared/lib";
import { Button, Input } from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";
import { SwitchGroup } from "widgets/switch-group";

interface LibraryChatInputProps {
  switchOptions: string[];
  selectedSwitch: string;
  setSelectedSwitch: (option: string) => void;
  healthHistory?: HealthHistory;
  placeholder?: string;
  onSend?: (
    message: string,
    files: File[],
    selectedOption: string | null
  ) => void;
  disabled?: boolean;
  className?: string;
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  healthHistory,
  placeholder = "Your message",
  onSend,
  disabled = false,
  className,
  switchOptions,
  selectedSwitch,
  setSelectedSwitch,
}) => {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || disabled) return;
    onSend?.(message, attachedFiles, null);
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
      <SwitchGroup
        options={switchOptions}
        activeOption={selectedSwitch}
        onChange={setSelectedSwitch}
        classname="mb-4"
      />
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
            {attachedFiles.length > 0 && (
              <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -left-1">
                {attachedFiles.length > 99 ? "99+" : attachedFiles.length}
              </span>
            )}
          </label>
          {healthHistory && <HealthProfileForm healthHistory={healthHistory} />}
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
