import { HealthHistory } from "entities/health-history";
import { ChevronDown, ChevronUp, Paperclip, Send } from "lucide-react";
import React, { useState } from "react";
import { cn } from "shared/lib";
import { Button, Input, Switch } from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";

interface LibraryChatInputProps {
  healthHistory?: HealthHistory;
  placeholder?: string;
  onSend?: (
    message: string,
    files: File[],
    selectedOption: string | null
  ) => void;
  disabled?: boolean;
  className?: string;
  personalize?: boolean;
  isContentMode?: boolean;
  toggleIsContentMode?: () => void;
  togglePersonalize?: () => void;
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  healthHistory,
  placeholder = "Your message",
  onSend,
  disabled = false,
  className,
  personalize,
  togglePersonalize,
  isContentMode,
  toggleIsContentMode,
}) => {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState(false);

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || disabled) return;
    onSend?.(message, attachedFiles, personalize ? selectedOption : null);
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

  const toggleDropdown = () => {
    setActiveDropdown(!activeDropdown);
  };

  const handleSelection = (value: string) => {
    setSelectedOption(value);
    setActiveDropdown(false);
  };

  return (
    <div className={cn("p-4 bg-white border-t border-gray-200", className)}>
      <div className="flex justify-between items-center mb-4 h-[44px]">
        <div className="flex items-center gap-2">
          <Switch
            checked={personalize}
            onCheckedChange={togglePersonalize}
            id="personalize-search"
          />
          <label
            htmlFor="personalize-search"
            className={`text-sm ${
              personalize ? "text-[#1C63DB]" : "text-gray-700"
            } cursor-pointer`}
          >
            Personalize search
          </label>

          {toggleIsContentMode && (
            <>
              <Switch
                checked={isContentMode}
                onCheckedChange={toggleIsContentMode}
                id="content-mode"
              />
              <label
                htmlFor="content-mode"
                className={`text-sm ${
                  personalize ? "text-[#1C63DB]" : "text-gray-700"
                } cursor-pointer`}
              >
                Content mode
              </label>
            </>
          )}
        </div>
        {personalize && (
          <div className="relative">
            <button
              type="button"
              className="flex w-[300px] h-[44px] items-center justify-between border-[#DFDFDF] border rounded-[8px] py-[11px] px-[16px] cursor-pointer"
              onClick={toggleDropdown}
            >
              <span className="text-[#1D1D1F] font-medium text-[16px]">
                {selectedOption || "Personal Story"}
              </span>
              {activeDropdown ? (
                <ChevronUp className="text-[#5F5F65]" />
              ) : (
                <ChevronDown className="text-[#5F5F65]" />
              )}
            </button>
            {activeDropdown && (
              <div className="absolute z-10 flex flex-col items-start w-[300px] mt-1 bg-white border rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                {["Personal Story", "Health Profile"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`p-3 w-full text-left text-[16px] font-medium text-[#1D1D1F] hover:text-[#1C63DB] ${
                      selectedOption === item ? "bg-[#E4E9F2]" : ""
                    }`}
                    onClick={() => handleSelection(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
