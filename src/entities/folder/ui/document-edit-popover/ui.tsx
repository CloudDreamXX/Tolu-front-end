import { IDocument } from "entities/document";
import { Archive, ArrowRight, Trash2 } from "lucide-react";
import Box from "shared/assets/icons/box";
import Dots from "shared/assets/icons/dots";
import Duplicate from "shared/assets/icons/duplicate";
import Edit from "shared/assets/icons/edit";
import Expert from "shared/assets/icons/expert";
import { Eye } from "shared/assets/icons/eye";
import { Button, Popover, PopoverContent, PopoverTrigger } from "shared/ui";
import { IFolder } from "../document-card";

interface IPopoverDocumentEditProps {
  document?: IDocument;
  folder?: IFolder;
  customTrigger?: React.ReactNode;
  tab?: string;
}

export const DocumentEditPopover: React.FC<IPopoverDocumentEditProps> = ({
  document,
  customTrigger,
  tab,
  folder,
}) => (
  <Popover>
    <PopoverTrigger
      className="cursor-pointer rounded-full hover:bg-[#F9FAFB]"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {customTrigger ?? <Dots className="w-5 h-5" />}
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
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Expert className="h-6 min-w-6" /> Mark as approved
      </Button>
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
