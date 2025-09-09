import { PopoverInstruction } from "widgets/content-popovers";

interface InstructionInfoProps {
  instructions?: string | null;
  folderInstructions?: string | null;
  title?: string;
  description?: string;
  setInstruction?: (instruction: string) => void;
}

export const InstructionInfo: React.FC<InstructionInfoProps> = ({
  title,
  description,
  folderInstructions,
  instructions,
  setInstruction,
}) => {
  return (
    <PopoverInstruction
      customTrigger={
        <button className="flex flex-row items-baseline group">
          <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
            Instructions
          </div>
        </button>
      }
      title={title}
      description={description}
      existingInstruction={instructions || ""}
      folderInstruction={folderInstructions || ""}
      setInstruction={setInstruction}
    />
  );
};
