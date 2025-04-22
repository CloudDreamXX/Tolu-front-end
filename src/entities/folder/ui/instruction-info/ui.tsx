import { PopoverInstruction } from "widgets/content-popovers";

interface InstructionInfoProps {
  instructions?: string[];
  title?: string;
  description?: string;
}

export const InstructionInfo: React.FC<InstructionInfoProps> = ({
  instructions,
  title,
  description,
}) => {
  return (
    <PopoverInstruction
      customTrigger={
        <button className="flex flex-row items-end group">
          <h4 className="text-lg font-semibold">
            Instructions: {instructions?.length ? "Yes" : "No"}
          </h4>
          <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            / View
          </div>
        </button>
      }
      title={title}
      description={description}
    />
  );
};
