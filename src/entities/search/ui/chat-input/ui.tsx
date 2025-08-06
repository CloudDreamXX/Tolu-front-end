import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "shared/lib";
import { Button, Input, Switch } from "shared/ui";
import { SymptomCheckModal, MultiStepModal } from "widgets/MenopauseModals";
import { MenopauseSubmissionRequest, UserService } from "entities/user";

interface SearchAiChatInputProps {
  placeholder?: string;
  onFileAttach?: (files: File[]) => void;
  className?: string;
  onSend?: (message: string, files: File[], searchType: string) => void;
  disabled?: boolean;
}

export const SearchAiChatInput: React.FC<SearchAiChatInputProps> = ({
  placeholder = "Your message",
  onFileAttach,
  className = "",
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState<string>("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

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

  const handleStartCheckIn = () => {
    setModalOpen(false);
    setStepModalOpen(true);
  };

  const handleFinishCheckIn = async (results: MenopauseSubmissionRequest) => {
    await UserService.submitMenopauseResults(results);
    setStepModalOpen(false);
    setCompletionModalOpen(true);

    // try {
    //   const data = await UserService.getMenopauseRecommendations();
    // } catch (error) {
    //   console.error("Failed to load recommendations", error);
    // }
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full px-3 py-4 mt-auto gap-4 bg-white",
        className
      )}
    >
      <div className="items-center hidden gap-2 xl:flex">
        <Switch checked={false} onCheckedChange={() => {}} />
        <span className={cn("text-sm cursor-default ", "text-gray-700")}>
          Personalize search
        </span>
      </div>

      <Input
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center w-full gap-4">
          <label className="relative flex items-center gap-2 text-sm text-gray-600 transition-colors cursor-pointer hover:text-gray-800 hover:bg-gray-100">
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

          <Button variant={"brightblue"} onClick={() => setModalOpen(true)}>
            Symptoms Tracker
          </Button>
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() && attachedFiles.length === 0}
          className="w-10 h-10 p-0 ml-auto bg-blue-500 rounded-full bottom-3 right-3 hover:bg-blue-600 disabled:opacity-50"
          title={
            message.trim() || attachedFiles.length
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
      <div className="flex items-center gap-2 xl:hidden">
        <Switch checked={false} onCheckedChange={() => {}} />
        <span className={cn("text-sm cursor-default ", "text-gray-700")}>
          Personalize search
        </span>
      </div>

      <SymptomCheckModal
        isOpen={modalOpen}
        onStepModalOpen={handleStartCheckIn}
        onClose={() => setModalOpen(false)}
        variant="intro"
      />

      <MultiStepModal
        isOpen={stepModalOpen}
        onClose={() => setStepModalOpen(false)}
        onComplete={handleFinishCheckIn}
      />

      <SymptomCheckModal
        isOpen={completionModalOpen}
        onStepModalOpen={() => setCompletionModalOpen(false)}
        onClose={() => setCompletionModalOpen(false)}
        variant="completion"
      />
    </div>
  );
};
