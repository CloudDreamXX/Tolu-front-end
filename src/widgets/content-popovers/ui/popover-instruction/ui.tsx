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
  title?: string;
  description?: string;
}

export const PopoverInstruction: React.FC<PopoverInstructionProps> = ({
  customTrigger,
  title = "Add instructions to folder",
  description = "Enhance content quality by providing credible references",
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant={"outline"}
            className="flex flex-col w-full gap-3 py-[8px] px-[16px] md:p-[16px] xl:px-[32px] xl:py-[16px] rounded-[18px] h-fit"
          >
            <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
              <Setting width={28} height={28} />
              Add instructions to folder
            </h4>
            <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
              Instruct how you want Tolu to respond
            </p>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full xl:w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        <h4 className="flex flex-row gap-2 text-xl font-bold">
          <Setting width={28} height={28} />
          {title}
        </h4>
        <p className="text-sm text-[#5F5F65]">{description}</p>
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
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
