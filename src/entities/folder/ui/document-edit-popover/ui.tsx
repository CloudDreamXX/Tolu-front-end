import Expert from "shared/assets/icons/expert";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button, Popover, PopoverContent, PopoverTrigger } from "shared/ui";

interface IPopoverDocumentEditProps {
  customTrigger?: React.ReactNode;
}

export const DocumentEditPopover: React.FC<IPopoverDocumentEditProps> = ({
  customTrigger,
}) => (
  <Popover>
    <PopoverTrigger
      className="cursor-pointer rounded-full hover:bg-[#F9FAFB]"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {customTrigger ?? <MaterialIcon iconName="more_vert" size={20} />}
    </PopoverTrigger>
    <PopoverContent
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="bg-white flex flex-col gap-4 py-4 px-3.5 w-[238px] rounded-lg shadow-md border border-[#fff]"
      align="start"
      side="left"
    >
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <MaterialIcon iconName="edit" /> Edit
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <MaterialIcon iconName="keyboard_arrow_right" /> Move
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <MaterialIcon iconName="stack" fill={1} /> Duplicate
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <MaterialIcon iconName="visibility" fill={1} /> Duplicate
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Expert className="h-6 min-w-6" /> Mark as approved
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <MaterialIcon iconName="forum" fill={1} /> Mark as ready to publish
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <MaterialIcon iconName="book_2" fill={1} /> Archive
      </Button>
      <Button
        variant={"ghost"}
        className="justify-start h-6 p-0 font-medium text-destructive"
      >
        <MaterialIcon iconName="delete" className="text-[#FF1F0F]" /> Delete
      </Button>
    </PopoverContent>
  </Popover>
);
