import { NavLink } from "react-router-dom";

interface DocumentFileInfoProps {
  files?: string[];
}

export const DocumentFileInfo: React.FC<DocumentFileInfoProps> = ({
  files,
}) => {
  return (
    <NavLink className="flex flex-row items-end group" to={`/content-manager`}>
      <h4 className="text-lg font-semibold">
        Attached files: {files?.length ?? "N/A"}
      </h4>
      <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
        / View
      </div>
    </NavLink>
  );
};
