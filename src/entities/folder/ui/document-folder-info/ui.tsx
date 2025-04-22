import { NavLink } from "react-router-dom";
import { PopoverAttach } from "widgets/content-popovers";

interface DocumentFolderInfoProps {
  folderId: string;
  folderName: string;
}

export const DocumentFolderInfo: React.FC<DocumentFolderInfoProps> = ({
  folderId,
  folderName,
}) => {
  return (
    <NavLink
      to={`/content-manager/folder/${folderId}`}
      className="flex flex-row items-end group"
    >
      <h4 className="text-lg font-semibold">Original folder: {folderName}</h4>
      <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
        / Go to folder
      </div>
    </NavLink>
  );
};
