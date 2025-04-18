import { PopoverInstruction } from "widgets/content-popovers";

interface DocumentInstructionInfoProps {
  instructions?: string[];
}

export const DocumentInstructionInfo: React.FC<
  DocumentInstructionInfoProps
> = ({ instructions }) => {
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
    />
  );
};
