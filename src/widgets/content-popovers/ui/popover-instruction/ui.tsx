import Setting from "shared/assets/icons/setting";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
} from "shared/ui";

interface PopoverInstructionProps {
  customTrigger?: React.ReactNode;
}

export const PopoverInstruction: React.FC<PopoverInstructionProps> = ({
  customTrigger,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant={"outline"}
            className="flex flex-col w-full gap-3 py-4 rounded-3xl h-fit"
          >
            <h4 className="flex flex-row gap-2 text-xl font-bold">
              <Setting width={28} height={28} />
              Add instructions to folder
            </h4>
            <p className="text-sm text-[#5F5F65]">
              Enhance content quality by providing credible references
            </p>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[742px] p-6 flex flex-col gap-6 bg-[#F9FAFB]">
        <h4 className="flex flex-row gap-2 text-xl font-bold">
          <Setting width={28} height={28} />
          Add instructions to folder
        </h4>
        <p className="text-sm text-[#5F5F65]">
          Enhance content quality by providing credible references
        </p>
        <Textarea className="h-32 resize-none" />
        <div className="flex flex-row justify-between">
          <Button
            variant={"light-blue"}
            className="w-[128px]"
            onClick={() => {}}
          >
            Cancel
          </Button>
          <Button variant={"blue"} className="w-[128px]" onClick={() => {}}>
            Attach
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
