import { PopoverInstruction } from "widgets/content-popovers";

interface InstructionInfoProps {
  instructions?: string | null;
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
        <button className="flex flex-row items-baseline group">
          <h4 className="text-[18px] font-semibold">
            Instructions: {instructions?.length ? "Yes" : "No"}
          </h4>
          <div className="text-[12px] font-semibold group-hover:text-[#008FF6]">
            &nbsp;/ View
          </div>
        </button>
      }
      title={title}
      description={description}
    />
  );
};
