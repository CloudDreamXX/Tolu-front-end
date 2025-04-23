import Dots from "shared/assets/icons/dots";

import { Button, Popover, PopoverTrigger, PopoverContent } from "shared/ui";
import { IDocument } from "../document-card";
import { renderContent } from "./lib";

interface IPopoverDocumentEditProps {
  document: IDocument;
  customTrigger?: React.ReactNode;
  tab?: string;
}

export const DocumentEditPopover: React.FC<IPopoverDocumentEditProps> = ({
  document,
  customTrigger,
  tab,
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
    >
      {renderContent(tab ?? document.status)}
    </PopoverContent>
  </Popover>
);
