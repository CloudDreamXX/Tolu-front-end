import { PopoverAttach } from "widgets/content-popovers";

interface DocumentFileInfoProps {
  files?: string[];
}

export const DocumentFileInfo: React.FC<DocumentFileInfoProps> = ({
  files,
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
    />
  );
};
