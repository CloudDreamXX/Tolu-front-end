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
        <button className="flex flex-row items-end group">
          <h4 className="text-lg font-semibold">
            Attached files: {files?.length ?? "N/A"}
          </h4>
          <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            / View
          </div>
        </button>
      }
      title={title}
      description={description}
    />
  );
};
