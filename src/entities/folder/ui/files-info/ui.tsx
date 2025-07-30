import { PopoverAttach } from "widgets/content-popovers";

interface FilesInfoProps {
  files?: string[];
  title?: string;
  description?: string;
}

export const FilesInfo: React.FC<FilesInfoProps> = ({ title, description }) => {
  return (
    <PopoverAttach
      customTrigger={
        <button className="flex flex-row items-baseline group">
          <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
            Attached files
          </div>
        </button>
      }
      title={title}
      description={description}
    />
  );
};
