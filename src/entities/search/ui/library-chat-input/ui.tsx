import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import SymptomsTracker from "shared/assets/icons/symptoms-tracker";
import { cn } from "shared/lib";
import { Button, Input } from "shared/ui";
import { SwitchGroup } from "widgets/switch-group";
import { SymptomCheckModal, MultiStepModal } from "widgets/MenopauseModals";
import { MenopauseSubmissionRequest, UserService } from "entities/user";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";

interface LibraryChatInputProps {
  switchOptions: string[];
  selectedSwitch: string;
  setSelectedSwitch: (option: string) => void;
  placeholder?: string;
  onSend?: (
    message: string,
    files: File[],
    selectedOption: string | null
  ) => void;
  disabled?: boolean;
  className?: string;
  footer?: React.ReactNode;
  setNewMessage?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
}

export const LibraryChatInput: React.FC<LibraryChatInputProps> = ({
  placeholder = "Your message",
  onSend,
  disabled = false,
  className,
  switchOptions,
  selectedSwitch,
  setSelectedSwitch,
  setNewMessage,
  footer,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.client.loading);

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
    <div className={cn("p-4 bg-white border-t border-gray-200", className)}>
      {loading || isLoading ? (
        <div className="flex items-center gap-[16px] mb-[27px]">
          <div className="h-[22px] skeleton-gradient w-[110px] rounded-[24px]" />
          <div className="h-[22px] skeleton-gradient w-[110px] rounded-[24px]" />
          <div className="h-[22px] skeleton-gradient w-[110px] rounded-[24px]" />
        </div>
      ) : (
        <div className="hidden md:block">
          <SwitchGroup
            options={switchOptions}
            activeOption={selectedSwitch}
            onChange={setSelectedSwitch}
            classname="mb-4"
          />
        </div>
      )}
      <div className="relative mb-4">
        <Input
          placeholder={placeholder}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (setNewMessage) {
              setNewMessage(e.target.value);
            }
          }}
          onKeyDown={handleKeyPress}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {footer ? (
        footer
      ) : (
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
            <Button variant={"brightblue"} onClick={() => setModalOpen(true)}>
              <SymptomsTracker />{" "}
              <span className="hidden md:block">Symptoms Tracker</span>
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={isSendDisabled}
            className="w-10 h-10 p-0 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Send size={20} color="white" />
          </Button>
        </div>
      )}

      <div className="md:hidden block mt-[16px]">
        <SwitchGroup
          options={switchOptions}
          activeOption={selectedSwitch}
          onChange={setSelectedSwitch}
          classname="mb-4"
        />
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
