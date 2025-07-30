import { PopoverInstruction } from "widgets/content-popovers";

interface InstructionInfoProps {
  instructions?: string | null;
  title?: string;
  description?: string;
}

export const InstructionInfo: React.FC<InstructionInfoProps> = ({
  title,
  description,
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
    />
  );
};
