import Dots from "shared/assets/icons/dots";
import Eye from "shared/assets/icons/eye";
import Edit from "shared/assets/icons/edit";
import { Archive, ArrowRight, Trash2 } from "lucide-react";
import Duplicate from "shared/assets/icons/duplicate";
import Box from "shared/assets/icons/box";
import { Button, Popover, PopoverTrigger, PopoverContent } from "shared/ui";

export const DocumentEditPopover: React.FC = () => (
  <Popover>
    <PopoverTrigger
      className="cursor-pointer rounded-full hover:bg-[#F9FAFB]"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Dots className="w-5 h-5" />
    </PopoverTrigger>
    <PopoverContent
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="bg-white flex flex-col gap-4 py-4 px-3.5 w-[238px] rounded-lg shadow-md border border-[#fff]"
    >
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Edit /> Edit
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <ArrowRight /> Move
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Duplicate /> Duplicate
      </Button>{" "}
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Eye /> Mark as ready for review
      </Button>{" "}
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Box /> Mark as ready to publish
      </Button>{" "}
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Archive /> Archive
      </Button>{" "}
      <Button
        variant={"ghost"}
        className="justify-start h-6 p-0 font-medium text-destructive"
      >
        <Trash2 /> Delete
      </Button>
    </PopoverContent>
  </Popover>
);
