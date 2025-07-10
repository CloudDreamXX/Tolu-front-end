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
        <button className="flex flex-row items-baseline group">
          <h4 className="text-sm font-semibold md:text-base lg:text-lg">
            Attached files: {files?.length ?? "N/A"}
          </h4>
          <div className="text-[12px] font-semibold group-hover:text-[#008FF6]">
            &nbsp;/ View
          </div>
        </button>
      }
      title={title}
      description={description}
    />
  );
};
