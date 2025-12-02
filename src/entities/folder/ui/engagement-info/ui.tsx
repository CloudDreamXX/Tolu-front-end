import { IDocument } from "entities/document";
import { Button } from "shared/ui";
import { PopoverEngagement } from "widgets/content-popovers/ui/popover-engagement";

type Props = {
    document: IDocument;
};

export const EngagementInfo: React.FC<Props> = ({ document }) => {
    return (
        <PopoverEngagement
            document={document}
            customTrigger={
                <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    className="flex flex-row items-baseline group"
                >
                    <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
                        Engagement
                    </div>
                </Button>
            }
        />
    );
};