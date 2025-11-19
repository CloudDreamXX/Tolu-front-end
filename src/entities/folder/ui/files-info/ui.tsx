import { Button } from "shared/ui";
import { PopoverAttach } from "widgets/content-popovers";

interface FilesInfoProps {
  files?: string[];
  title?: string;
  description?: string;
}

export const FilesInfo: React.FC<FilesInfoProps> = ({
  title,
  description,
  files,
}) => {
  return (
    <PopoverAttach
      customTrigger={
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="flex flex-row items-baseline group"
        >
          <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
            Sources
          </div>
        </Button>
      }
      title={title}
      description={description}
      isDocumentPage
      existingFiles={files}
    />
  );
};
