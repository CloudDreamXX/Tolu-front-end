import { useEffect, useState } from "react";
import Setting from "shared/assets/icons/setting";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
  Badge,
} from "shared/ui";

interface PopoverInstructionProps {
  customTrigger?: React.ReactNode;
  title?: string;
  description?: string;
  setInstruction?: (instruction: string) => void;
  existingInstruction?: string;
}

export const PopoverInstruction: React.FC<PopoverInstructionProps> = ({
  customTrigger,
  title = "Add instructions to folder",
  description = "Instruct how you want Tolu to respond",
  setInstruction,
  existingInstruction = "",
}) => {
  const [instructionText, setInstructionText] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [savedInstruction, setSavedInstruction] = useState<string>("");

  useEffect(() => {
    if (existingInstruction) {
      setSavedInstruction(existingInstruction);
      setInstructionText(existingInstruction);
      setInstruction?.(existingInstruction);
    }
  }, [existingInstruction]);

  const handleSave = () => {
    setSavedInstruction(instructionText);
    setInstruction?.(instructionText);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setInstructionText(savedInstruction);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInstructionText("");
    setSavedInstruction("");
    setInstruction?.("");
    setIsOpen(false);
  };

  const hasInstruction = savedInstruction || existingInstruction;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant={"outline"}
            className="relative flex flex-col w-full gap-3 py-[8px] px-[16px] md:p-[16px] xl:px-[32px] xl:py-[16px] rounded-[18px] h-fit"
          >
            <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
              <Setting width={28} height={28} />
              Add instructions to folder
            </h4>
            <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
              Instruct how you want Tolu to respond
            </p>
            {hasInstruction && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold bg-green-500"
              >
                ✓
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full xl:w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        <h4 className="flex flex-row gap-2 text-xl font-bold">
          <Setting width={28} height={28} />
          {title}
        </h4>
        <p className="text-sm text-[#5F5F65]">{description}</p>

        {existingInstruction && (
          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div className="mb-1 text-sm font-medium text-blue-800">
              Existing folder instruction:
            </div>
            <div className="text-sm text-blue-700 whitespace-pre-wrap">
              {existingInstruction}
            </div>
          </div>
        )}

        {savedInstruction && savedInstruction !== existingInstruction && (
          <div className="p-3 border border-green-200 rounded-lg bg-green-50">
            <div className="mb-1 text-sm font-medium text-green-800">
              Current instruction:
            </div>
            <div className="text-sm text-green-700 whitespace-pre-wrap">
              {savedInstruction}
            </div>
          </div>
        )}

        <Textarea
          className="h-32 resize-none"
          placeholder="Enter your instructions here..."
          value={instructionText}
          onChange={(e) => setInstructionText(e.target.value)}
        />

        <div className="flex flex-row justify-between">
          <div className="flex gap-2">
            <Button
              variant={"light-blue"}
              className="w-[128px]"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {hasInstruction && (
              <Button
                variant={"outline"}
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
          </div>
          <Button
            variant={"blue"}
            className="w-[128px]"
            onClick={handleSave}
            disabled={!instructionText.trim()}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
