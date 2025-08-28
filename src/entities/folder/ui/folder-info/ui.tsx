import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface FolderInfoProps {
  folderName?: string;
}

export const FolderInfo: React.FC<FolderInfoProps> = ({ folderName }) => {
  return (
    <button className="flex flex-row items-end group">
      <h4 className="flex flex-row text-lg font-bold">
        <MaterialIcon iconName="folder_open" fill={1} className="mr-1" />
        {folderName}
      </h4>
      <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
        / Edit
      </div>
    </button>
  );
};
