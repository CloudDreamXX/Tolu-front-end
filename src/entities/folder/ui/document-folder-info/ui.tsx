import { NavLink } from "react-router-dom";

interface DocumentFolderInfoProps {
  folderId: string;
  folderName: string;
}

export const DocumentFolderInfo: React.FC<DocumentFolderInfoProps> = ({
  folderId,
}) => {
  const location = window.location.pathname;
  const tab = location.split("/")[3];

  return (
    <NavLink
      to={`/content-manager/folder/${tab}/${folderId}`}
      className="flex flex-row items-end group"
    >
      <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
        Original folder
      </div>
    </NavLink>
  );
};
