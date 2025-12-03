import { IDocument } from "entities/document";
import { Popover, PopoverTrigger, PopoverContent } from "shared/ui/popover";
import { UserEngagementSidebar } from "widgets/user-engagement-sidebar";

interface EngagementPopoverProps {
  document: IDocument;
  customTrigger?: React.ReactNode;
  disabled?: boolean;
}

export const PopoverEngagement: React.FC<EngagementPopoverProps> = ({
  customTrigger,
  disabled,
  document,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {customTrigger || <button>Engagement</button>}
      </PopoverTrigger>

      <PopoverContent className="p-0 w-full h-full max-h-[80vh] overflow-y-auto">
        <UserEngagementSidebar document={document} />
      </PopoverContent>
    </Popover>
  );
};
