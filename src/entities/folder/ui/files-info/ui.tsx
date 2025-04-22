import { Pencil } from "lucide-react";
import { PopoverAttach } from "widgets/content-popovers";

interface FilesInfoProps {
  files?: string[];
  title?: string;
  description?: string;
  isAttached?: boolean;
}

export const FilesInfo: React.FC<FilesInfoProps> = ({
  files,
  title,
  description,
  isAttached,
}) => {
  return (
    <PopoverAttach
      customTrigger={
        <button className="flex flex-row items-center group">
          <h4 className="text-lg font-semibold">
            Attached files: {files?.length ?? "N/A"}
          </h4>
          <div className="ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            <Pencil width={16} height={16} />
          </div>
        </button>
      }
      title={title}
      description={description}
      isAttached={isAttached}
    />
  );
};
