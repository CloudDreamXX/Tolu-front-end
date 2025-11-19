import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";
import { PopoverAttach } from "widgets/content-popovers";

interface FilesInfoProps {
  files?: string[];
  title?: string;
  description?: string;
}

export const FilesInfo: React.FC<FilesInfoProps> = ({
  files,
  title,
  description,
}) => {
  return (
    <PopoverAttach
      customTrigger={
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="flex flex-row items-end group"
        >
          <h4 className="text-lg font-semibold">
            Sources: {files?.length ?? "N/A"}
          </h4>
          <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            <MaterialIcon iconName="edit" size={16} />
          </div>
        </Button>
      }
      title={title}
      description={description}
    />
  );
};
